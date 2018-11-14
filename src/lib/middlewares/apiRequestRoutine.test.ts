import {APIGatewayProxyEvent} from 'aws-lambda';
import clone from 'clone';
import {NotFound, UnprocessableEntity} from 'http-errors';
import middy from 'middy';
import {INormalizedEvent} from '../../@types';
import {event} from '../fixtures/events';
import {Joi} from '../validation';
import {
  apiRequestRoutine,
  buildErrorResponse,
  buildJSONResponse,
  parseJSONBody,
  setDefaultParams
} from './apiRequestRoutine';

describe('apiRequestRoutine', () => {
  let demoEvent: APIGatewayProxyEvent;
  beforeEach(() => {
    demoEvent = clone(event);
  });
  it('parseJSONBody should return convert event.body to json', () => {
    parseJSONBody(demoEvent);
    expect(demoEvent.body).toEqual({foo: 'bar'});
  });

  it('parseJSONBody should throw error if event.body is not a json', () => {
    demoEvent.body = 'not a json';
    expect(parseJSONBody.bind(null, demoEvent)).toThrowError(UnprocessableEntity);
  });

  it('parseJSONBody should do nothing if there is no body', () => {
    demoEvent.body = null;
    parseJSONBody(demoEvent);
    expect(demoEvent.body).toBeNull();
  });

  it('setDefaultParams should set default query and path parameters', () => {
    setDefaultParams(demoEvent);
    expect(demoEvent.queryStringParameters).toEqual({});
    expect(demoEvent.pathParameters).toEqual({});
  });

  it('buildJSONResponse should build a correct response object', () => {
    expect(buildJSONResponse({foo: 'bar'})).toMatchSnapshot();
  });

  it('buildJSONResponse should build redirect response if redirectUrl is present', () => {
    expect(buildJSONResponse({redirectUrl: 'https://example.com'})).toMatchSnapshot();
  });

  it('buildJSONResponse should build custom response if statusCode is present', () => {
    expect(buildJSONResponse({statusCode: 200, body: 'custom body'})).toMatchSnapshot();
  });

  it('buildJSONResponse should build no content if response is empty', () => {
    expect(buildJSONResponse(undefined)).toMatchSnapshot();
  });

  it('buildErrorResponse should build a correct response object in case of the internal error', () => {
    expect(buildErrorResponse(new Error('Some internal error'))).toMatchSnapshot();
  });

  it('buildErrorResponse should build a correct response object in case of the validation error', () => {
    const schema = Joi.object().keys({foo: Joi.string().required()});
    const {error} = Joi.validate({}, schema);
    expect(buildErrorResponse(error)).toMatchSnapshot();
  });

  it('buildErrorResponse should build a correct response object in case of the http error', () => {
    expect(buildErrorResponse(new NotFound('Recourse not found'))).toMatchSnapshot();
  });

  it('should normalize event', () => {
    const handler = middy(async (event: INormalizedEvent) => {
      expect(event).toMatchSnapshot();
    });
    handler.use(apiRequestRoutine());
    // @ts-ignore
    handler(demoEvent, {}, () => {});
  });

  it('should return success response', () => {
    const handler = middy(async () => {
      return {foo: 'bar'};
    });
    handler.use(apiRequestRoutine());

    // @ts-ignore
    handler(demoEvent, {}, (error, response) => {
      expect(error).toBeNull();
      expect(response).toMatchSnapshot();
    });
  });

  it('should return error response if http error is thrown in handler', () => {
    const handler = middy(async () => {
      throw new NotFound('Recourse not found');
    });
    handler.use(apiRequestRoutine());

    // @ts-ignore
    handler(demoEvent, {}, (error, response) => {
      expect(error).toBeNull();
      expect(response).toMatchSnapshot();
    });
  });

  it('should return error response if internal error is thrown in handler', () => {
    const handler = middy(async () => {
      throw new Error('Some internal error');
    });
    handler.use(apiRequestRoutine());

    // @ts-ignore
    handler(demoEvent, {}, (error, response) => {
      expect(error).toBeNull();
      expect(response).toMatchSnapshot();
    });
  });
});
