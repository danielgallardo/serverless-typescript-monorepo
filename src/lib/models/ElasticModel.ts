import {DynamoDBStreamEvent} from 'aws-lambda';
import AWS from 'aws-sdk';
import bodyBuilder, {AggregationBuilder, FilterBuilder, QueryBuilder} from 'bodybuilder';
import {AttributeValue as attr} from 'dynamodb-data-types';
import {Client} from 'elasticsearch';
import httpAwsEs from 'http-aws-es';
import {logDebugInfo} from '../logger';
import {assert, getEnv, Joi} from '../validation';

const awsCredentials = new AWS.EnvironmentCredentials('AWS');

// Read about mappings
// https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping.html
export type ElasticMapping = {
  [key: string]: {
    type?: string;
    format?: string;
    enabled?: boolean;
    index?: boolean;
    ignore_malformed?: boolean;
    properties?: ElasticMapping;
  };
};

export type Item = {
  [key: string]: any;
};

export type Query = {
  [key: string]: any;
};

export type ActionDescription = {
  _index: string;
  _type: string;
  _id: string;
};

export interface ISearchResult<T> {
  items: T[];
  total: number;
  nextPage?: string;
  prevPage?: string;
}

export interface IBodyBuilder<T>
  extends Object,
    QueryBuilder<IBodyBuilder<T>>,
    FilterBuilder<IBodyBuilder<T>>,
    AggregationBuilder<IBodyBuilder<T>> {
  sort(field: string, direction?: string): IBodyBuilder<T>;
  sort(field: string, body: object): IBodyBuilder<T>;
  sort(fields: Array<{[field: string]: string | object} | string>): IBodyBuilder<T>;
  from(quantity: number): IBodyBuilder<T>;
  size(quantity: number): IBodyBuilder<T>;
  rawOption(k: string, v: any): IBodyBuilder<T>;
  build(version?: string): object;
  exec(): Promise<ISearchResult<T>>;
}

export interface IElasticModelConfig {
  host: string;
  indexName: string;
  region?: string;
  typeName?: string;
  mapping?: ElasticMapping;
  idField?: string;
}

// validate config in runtime to prevent empty env variables
const configSchema = Joi.object().keys({
  host: Joi.string().required(),
  indexName: Joi.string().required(),
  region: Joi.string(),
  typeName: Joi.string(),
  mapping: Joi.object(),
  idField: Joi.string()
});

export class ElasticModel<T extends Item> {
  protected client: Client;
  protected indexName: string;
  protected typeName: string;
  protected idField: string;
  protected mapping?: ElasticMapping;

  constructor(config: IElasticModelConfig) {
    assert(config, configSchema, 'ElasticModel config');
    // AWS_REGION is always defined as the AWS region where the Lambda function is executed
    const region = config.region || getEnv('AWS_REGION');
    AWS.config.update({region});
    this.indexName = config.indexName;
    this.typeName = config.typeName || config.indexName;
    this.mapping = config.mapping;
    this.idField = config.idField || 'id';
    this.client = new Client({
      hosts: config.host,
      apiVersion: '6.3',
      connectionClass: httpAwsEs,
      amazonES: {
        region,
        credentials: awsCredentials
      }
    });
  }

  /**
   * Imports multiple items to elasticsearch
   * @param items - array of items to be imported
   */
  public async bulkIndex(items: T[] = []) {
    await this.createIndexIfMissing();
    const body: Array<(T | {index: ActionDescription})> = [];
    items.forEach(item => {
      body.push({
        index: {
          _index: this.indexName,
          _type: this.typeName,
          _id: item[this.idField]
        }
      });
      body.push(item);
    });
    logDebugInfo('elasticModel.bulkIndex', body);
    return this.client.bulk({body});
  }

  /**
   * Executes search query
   * @param query - search query
   */
  public async search(query: Query): Promise<ISearchResult<T>> {
    const params = {
      index: this.indexName,
      type: this.typeName,
      body: query
    };
    logDebugInfo('elasticModel.search', params);
    const response = await this.client.search(params);

    const result: ISearchResult<T> = {
      items: response.hits.hits.map(hit => hit._source as T),
      total: response.hits.total
    };

    // TODO: deprecate pagination when front-end is ready
    const size = query.size || 25;
    const from = query.from || 0;
    const total = response.hits.total || 0;

    if (from > 0) result.prevPage = String(from - size);
    if (from + size < total) result.nextPage = String(from + size);

    return result;
  }

  /**
   * Returns BodyBuilder chainable query
   * read more - https://www.npmjs.com/package/bodybuilder
   * Call query.exec at the end to execute the query
   */
  public query(): IBodyBuilder<T> {
    const self = this;
    const query = bodyBuilder() as IBodyBuilder<T>;
    query.exec = function() {
      return self.search(this.build());
    };
    return query;
  }

  /**
   * Deletes index: indexName from elasticsearch
   */
  public async deleteIndex() {
    return this.client.indices.delete({index: this.indexName});
  }

  /**
   * Updates data in elasticsearch from dynamoDB stream event
   * use this method in stream event handler and pass the event directly to it
   * @param streamEvent - DynamoDB stream event
   */
  public async indexFromDynamoDBStream(streamEvent: DynamoDBStreamEvent) {
    const body: object[] = [];
    streamEvent.Records.forEach(record => {
      if (!record.dynamodb || !record.dynamodb.Keys) return;

      // dynamodb.Keys is a separate object that is present even in REMOVE event.
      // It contains doc id. Unwrapping it to get a normal object from dynamoDB format
      const identifier = attr.unwrap(record.dynamodb.Keys);
      const action = {
        _index: this.indexName,
        _type: this.typeName,
        _id: identifier[this.idField]
      };
      switch (record.eventName) {
        case 'INSERT':
          body.push({index: action});
          body.push(attr.unwrap(record.dynamodb.NewImage!));
          break;
        case 'MODIFY':
          body.push({update: action});
          body.push({doc: attr.unwrap(record.dynamodb.NewImage!)});
          break;
        case 'REMOVE':
          body.push({delete: action});
          break;
      }
    });
    logDebugInfo('elasticModel.indexFromDynamoDBStream', body);
    return this.client.bulk({body});
  }

  /**
   * Creates an index in elasticsearch if it doesn't exist
   * if mapping was defined in config, it will be created for an index as well
   */
  protected async createIndexIfMissing() {
    const params = {index: this.indexName};
    logDebugInfo('elasticModel.createIndexIfMissing', params);

    // check if index already exists
    const indexExists = await this.client.indices.exists(params);
    if (indexExists) return true;

    // create index
    await this.client.indices.create(params);

    // create mapping for a new index if specified
    if (this.mapping) return this.createMappingForIndex();
    return true;
  }

  /**
   * Creates mapping for an index in elasticsearch
   * see https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping.html
   * for more details on mapping
   */
  protected async createMappingForIndex() {
    const index = this.indexName;
    const type = this.typeName;
    const body = {
      [type]: {properties: this.mapping}
    };
    const params = {index, type, body};
    logDebugInfo('elasticModel.createMappingForIndex', params);
    const result = await this.client.indices.putMapping(params);
    return result.acknowledged;
  }
}
