import {APIGatewayProxyEvent, DynamoDBStreamEvent} from 'aws-lambda';
import {INormalizedEvent} from '../../@types';

export const event: APIGatewayProxyEvent = {
  resource: '/test',
  path: '/test',
  httpMethod: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  },
  multiValueHeaders: {foo: ['bar']},
  multiValueQueryStringParameters: {foo: ['bar']},
  queryStringParameters: null,
  pathParameters: null,
  stageVariables: null,
  requestContext: {
    resourceId: 'una98p',
    resourcePath: '/test',
    httpMethod: 'POST',
    path: '/dev/test',
    accountId: '862946620411',
    stage: 'dev',
    requestTimeEpoch: 1539156810614,
    requestId: 'c901f211-cc5e-11e8-b7a5-4bcd36c6e6f3',
    identity: {
      apiKey: null,
      apiKeyId: null,
      cognitoIdentityPoolId: null,
      accountId: null,
      cognitoIdentityId: null,
      caller: null,
      sourceIp: '35.123.74.111',
      accessKey: null,
      cognitoAuthenticationType: null,
      cognitoAuthenticationProvider: null,
      userArn: null,
      userAgent: 'axios/0.15.2',
      user: null
    },
    apiId: 'q27n90kff1'
  },
  body: '{"foo":"bar"}',
  isBase64Encoded: false
};

export const normalizedEvent: INormalizedEvent = {
  resource: '/test',
  path: '/test',
  httpMethod: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  },
  pathParameters: {},
  queryStringParameters: {},
  stageVariables: null,
  requestContext: {
    resourceId: 'una98p',
    resourcePath: '/test',
    httpMethod: 'POST',
    path: '/dev/test',
    accountId: '862946620411',
    stage: 'dev',
    requestTimeEpoch: 1539156810614,
    requestId: 'c901f211-cc5e-11e8-b7a5-4bcd36c6e6f3',
    identity: {
      apiKey: null,
      apiKeyId: null,
      cognitoIdentityPoolId: null,
      accountId: null,
      cognitoIdentityId: null,
      caller: null,
      sourceIp: '35.123.74.111',
      accessKey: null,
      cognitoAuthenticationType: null,
      cognitoAuthenticationProvider: null,
      userArn: null,
      userAgent: 'axios/0.15.2',
      user: null
    },
    apiId: 'q27n90kff1'
  },
  body: {foo: 'bar'},
  isBase64Encoded: false
};

export const dynamoDBStreamEvent: DynamoDBStreamEvent = {
  Records: [
    {
      eventID: '3e5dd41500a1b1f9a0cd4274b0104d37',
      eventName: 'INSERT',
      eventVersion: '1.1',
      eventSource: 'aws:dynamodb',
      awsRegion: 'eu-west-1',
      dynamodb: {
        ApproximateCreationDateTime: 1539636240,
        Keys: {
          id: {
            S: 'some-id'
          }
        },
        NewImage: {
          id: {
            S: 'some-id'
          },
          email: {
            S: 'email@example.com'
          }
        },
        SequenceNumber: '57609000000000001485363138',
        SizeBytes: 105,
        StreamViewType: 'NEW_IMAGE'
      },
      eventSourceARN:
        'arn:aws:dynamodb:eu-west-1:862946620411:table/sls-monorepo-dev-usersTable/stream/2018-10-03T15:15:59.162'
    },
    {
      eventID: 'b4d682c0e3116b5dd633dd09247182bd',
      eventName: 'REMOVE',
      eventVersion: '1.1',
      eventSource: 'aws:dynamodb',
      awsRegion: 'eu-west-1',
      dynamodb: {
        ApproximateCreationDateTime: 1539636300,
        Keys: {
          id: {
            S: 'some-id'
          }
        },
        SequenceNumber: '57609100000000001485392357',
        SizeBytes: 32,
        StreamViewType: 'NEW_IMAGE'
      },
      eventSourceARN:
        'arn:aws:dynamodb:eu-west-1:862946620411:table/sls-monorepo-dev-usersTable/stream/2018-10-03T15:15:59.162'
    },
    {
      eventID: '1502cbbb80137beb018d5195c2c2b63e',
      eventName: 'MODIFY',
      eventVersion: '1.1',
      eventSource: 'aws:dynamodb',
      awsRegion: 'eu-west-1',
      dynamodb: {
        ApproximateCreationDateTime: 1539635040,
        Keys: {
          id: {
            S: 'some-id'
          }
        },
        NewImage: {
          id: {
            S: 'some-id'
          },
          email: {
            S: 'email@example.com'
          }
        },
        SequenceNumber: '57608500000000001484605720',
        SizeBytes: 163,
        StreamViewType: 'NEW_IMAGE'
      },
      eventSourceARN:
        'arn:aws:dynamodb:eu-west-1:862946620411:table/sls-monorepo-dev-usersTable/stream/2018-10-03T15:15:59.162'
    }
  ]
};
