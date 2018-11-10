import {APIGatewayProxyEvent} from "aws-lambda";
import {NormalizedEvent} from "../../@types";

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

export const normalizedEvent: NormalizedEvent = {
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
