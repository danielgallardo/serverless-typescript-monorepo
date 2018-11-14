import clone from 'clone';
import Joi from 'joi';
import middy from 'middy';
import {INormalizedEvent} from '../../@types';
import {normalizedEvent} from '../fixtures/events';
import {apiRequestRoutine} from './apiRequestRoutine';
import {eventValidator} from './eventValidator';

describe('eventValidator', () => {
  let demoEvent: INormalizedEvent;
  beforeEach(() => {
    demoEvent = clone(normalizedEvent);
  });

  it('should pass validation with correct schema', () => {
    demoEvent.body = {foo: 'bar'};
    demoEvent.pathParameters = {path: 'parameter'};
    demoEvent.queryStringParameters = {query: 'parameter'};

    const schema = {
      body: Joi.object().keys({
        foo: Joi.string().required()
      }),
      pathParameters: Joi.object().keys({
        path: Joi.string().required()
      }),
      queryStringParameters: Joi.object().keys({
        query: Joi.string().required()
      })
    };

    const handler = middy(async () => {
      return {foo: 'bar'};
    });
    handler.use(eventValidator(schema));

    // @ts-ignore
    handler(demoEvent, {}, (error, response) => {
      expect(error).toBeNull();
      expect(response).toMatchSnapshot();
    });
  });

  it('should strip unknown params by default', () => {
    demoEvent.body = {foo: 'bar', extra: 'param'};

    const schema = {
      body: Joi.object().keys({
        foo: Joi.string().required()
      })
    };

    const handler = middy(async (event: INormalizedEvent) => {
      expect(event.body).toEqual({foo: 'bar'});
      return {foo: 'bar'};
    });
    handler.use(eventValidator(schema));

    // @ts-ignore
    handler(demoEvent, {}, (error, response) => {
      expect(error).toBeNull();
      expect(response).toMatchSnapshot();
    });
  });

  it('should be compatable with apiRequestRoutine', () => {
    demoEvent.body = JSON.stringify({foo: 'bar'});

    const schema = {
      body: {
        foo: Joi.string().required()
      }
    };

    const handler = middy(async () => {
      return {foo: 'bar'};
    });
    handler.use(apiRequestRoutine()).use(eventValidator(schema));

    // @ts-ignore
    handler(demoEvent, {}, (error, response) => {
      expect(error).toBeNull();
      expect(response).toMatchSnapshot();
    });
  });

  it('should respond with http error with apiRequestRoutine when schema is invalid', () => {
    demoEvent.body = JSON.stringify({foo: 'bar'});

    const schema = {
      body: Joi.object().keys({
        bar: Joi.string().required()
      })
    };

    const handler = middy(async () => {
      return {foo: 'bar'};
    });
    handler.use(apiRequestRoutine()).use(eventValidator(schema));

    // @ts-ignore
    handler(demoEvent, {}, (error, response) => {
      expect(error).toBeNull();
      expect(response).toMatchSnapshot();
    });
  });
});
