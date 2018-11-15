import {Client} from 'elasticsearch';
import {dynamoDBStreamEvent} from '../fixtures/events';
import {ElasticModel} from './ElasticModel';

jest.mock('elasticsearch');

const defaultConfig = {
  host: 'https://someurl.com',
  region: 'eu-west-1',
  indexName: 'existing-index'
};

describe('ElasticModel', () => {
  beforeEach(() => {
    // @ts-ignore
    Client.mockClear();
  });

  it('should throw en error if required config is missing', () => {
    // @ts-ignore
    expect(() => new ElasticModel({})).toThrowErrorMatchingSnapshot();
    // @ts-ignore
    expect(() => new ElasticModel({host: 'https://someurl.com'})).toThrowErrorMatchingSnapshot();
    expect(
      () =>
        // @ts-ignore
        new ElasticModel({
          host: 'https://someurl.com',
          region: 'eu-west-1',
          typeName: 'user'
        })
    ).toThrowErrorMatchingSnapshot();
    expect(
      () =>
        // @ts-ignore
        new ElasticModel({
          host: 'https://someurl.com',
          region: 'eu-west-1',
          indexName: 'user'
        })
    ).not.toThrow();
  });

  it('bulkIndex should create index if missing', async () => {
    const config = {
      host: 'https://someurl.com',
      region: 'eu-west-1',
      indexName: 'missing-index',
      mapping: {
        email: {
          type: 'text'
        },
        name: {
          type: 'text'
        }
      }
    };
    const data = [
      {
        id: 'some_id',
        email: 'example@email.com'
      }
    ];
    const model = new ElasticModel(config);
    // @ts-ignore
    const client = Client.mock.instances[0];
    const result = await model.bulkIndex(data);
    expect(client.indices.exists).toHaveBeenCalledWith({index: config.indexName});
    expect(client.indices.create).toHaveBeenCalledWith({index: config.indexName});
    expect(client.indices.putMapping).toHaveBeenCalledWith({
      index: config.indexName,
      type: config.indexName,
      body: {[config.indexName]: {properties: config.mapping}}
    });
    return expect(result).toMatchSnapshot();
  });

  it('deleteIndex should work correctly', async () => {
    const model = new ElasticModel(defaultConfig);
    // @ts-ignore
    const client = Client.mock.instances[0];
    const result = await model.deleteIndex();
    expect(client.indices.delete).toHaveBeenCalledWith({index: defaultConfig.indexName});
    return expect(result).toMatchSnapshot();
  });

  it('bulkIndex should not create index if already exists', async () => {
    const data = [
      {
        id: 'some_id',
        email: 'example@email.com'
      }
    ];
    const model = new ElasticModel(defaultConfig);
    // @ts-ignore
    const client = Client.mock.instances[0];
    const result = await model.bulkIndex(data);
    expect(client.indices.exists).toHaveBeenCalledWith({index: defaultConfig.indexName});
    expect(client.indices.create).not.toHaveBeenCalled();
    return expect(result).toMatchSnapshot();
  });

  it('search should return correct result', () => {
    const model = new ElasticModel(defaultConfig);
    return expect(model.search({size: 5, from: 5})).resolves.toMatchSnapshot();
  });

  it('query should work correctly', async () => {
    const model = new ElasticModel(defaultConfig);
    const searchSpy = jest.spyOn(model, 'search');
    const query = model
      .query()
      .sort('createdAt', 'desc')
      .from(5)
      .size(5);

    expect(query.exec).toBeDefined();

    const result = await query.exec();
    expect(result).toMatchSnapshot();
    expect(searchSpy).toHaveBeenCalledWith({
      size: 5,
      from: 5,
      sort: [{createdAt: {order: 'desc'}}]
    });
  });

  it('indexFromDynamoDBStream should generate correct bulk request', async () => {
    const config = {
      host: 'https://someurl.com',
      region: 'eu-west-1',
      typeName: 'existing-index',
      indexName: 'existing-index'
    };
    const model = new ElasticModel(config);
    // @ts-ignore
    const client = Client.mock.instances[0];
    await model.indexFromDynamoDBStream(dynamoDBStreamEvent);
    expect(client.bulk.mock.calls[0]).toMatchSnapshot();
  });
});
