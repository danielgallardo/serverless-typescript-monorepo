import {APIGatewayProxyEvent} from 'aws-lambda';
// @ts-ignore
import contentTypeLib from 'content-type';
import createError, {HttpError, ServiceUnavailable, UnprocessableEntity} from 'http-errors';
import {ValidationError} from 'joi';
import {IHandlerLambda, IMiddyNextFunction} from 'middy';
import {JoiError} from '../errors';
import {errorToJSON} from '../logger';

const DEFAULT_HEADERS = {
  'Access-Control-Allow-Origin': '*', // Required for CORS support to work
  'Access-Control-Allow-Credentials': true // Required for cookies, authorization headers with HTTPS
};

/**
 * Checks if body is a valid JSON and converts it to object
 * @param event
 */
export const parseJSONBody = (event: APIGatewayProxyEvent): void => {
  if (!event.headers || !event.body) return;
  const contentType = event.headers['Content-Type'] || event.headers['content-type'];
  if (contentType) {
    const {type} = contentTypeLib.parse(contentType);
    if (type === 'application/json') {
      try {
        event.body = JSON.parse(event.body);
      } catch (err) {
        throw new UnprocessableEntity(
          'Content type defined as JSON but an invalid JSON was provided'
        );
      }
    }
  }
};

/**
 * Sets queryStringParameters and pathParameters to {} by default
 * @param event
 */
export const setDefaultParams = (event: APIGatewayProxyEvent): void => {
  if (event.hasOwnProperty('httpMethod')) {
    event.queryStringParameters = event.queryStringParameters || {};
    event.pathParameters = event.pathParameters || {};
  }
};

interface IResponse {
  statusCode?: number;
  [key: string]: any;
}

/**
 * Builds a valid ApiGateway response based on returned value
 * redirects if response contains redirectUrl
 * @param response
 */
export const buildJSONResponse = (response?: IResponse): IResponse => {
  // return No Content response if there is no content
  if (!response) {
    return {
      statusCode: 204,
      headers: DEFAULT_HEADERS
    };
  }

  // return response directly if it contains statusCode
  if (response.statusCode) {
    return {
      ...response,
      headers: {
        ...DEFAULT_HEADERS,
        ...response.headers
      }
    };
  }

  // return redirect response if redirectUrl is defined
  if (response.redirectUrl) {
    return {
      statusCode: 302,
      headers: {
        ...DEFAULT_HEADERS,
        Location: response.redirectUrl
      }
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(response),
    headers: DEFAULT_HEADERS
  };
};

/**
 * Creates a public ServiceUnavailable error
 * provides original error details if env "DEBUG" is set to true
 * @param error
 */
const getServiceUnavailableError = (error: Error) => {
  const httpError = new ServiceUnavailable();
  if (process.env.DEBUG === 'true') {
    httpError.details = errorToJSON(error);
  }
  return httpError;
};

/**
 * Gets public error based on error type
 * @param error
 */
const getPublicError = (error: Error) => {
  if (error instanceof HttpError) return error;
  if (error instanceof JoiError) {
    if (error.internal) return getServiceUnavailableError(error);
    else return createError(422, error.message, {details: error.details});
  }
  if (error.name === 'ValidationError') {
    const validationError = new JoiError(error as ValidationError);
    return createError(422, validationError.message, {details: validationError.details});
  }
  return getServiceUnavailableError(error);
};

/**
 * Builds a valid ApiGateway error response based on error
 * @param error
 */
export const buildErrorResponse = (error: Error): IResponse => {
  const httpError = getPublicError(error);
  return {
    statusCode: httpError.statusCode,
    headers: DEFAULT_HEADERS,
    body: JSON.stringify({
      status: httpError.name,
      statusCode: httpError.statusCode,
      message: httpError.message,
      details: httpError.details
    })
  };
};

/**
 * A middleware that includes useful logic for ApiGateway handlers
 */
export const apiRequestRoutine = () => ({
  before(handler: IHandlerLambda, next: IMiddyNextFunction) {
    parseJSONBody(handler.event);
    setDefaultParams(handler.event);
    return next();
  },

  after(handler: IHandlerLambda, next: IMiddyNextFunction) {
    handler.response = buildJSONResponse(handler.response);
    return next();
  },

  onError(handler: IHandlerLambda, next: IMiddyNextFunction) {
    handler.response = buildErrorResponse(handler.error);
    return next();
  }
});
