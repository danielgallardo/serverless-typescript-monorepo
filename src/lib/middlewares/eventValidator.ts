import {SchemaLike, ValidationOptions} from 'joi';
import {IHandlerLambda, IMiddyNextFunction} from 'middy';
import {attempt} from '../validation';

const defaultOptions = {
  stripUnknown: true
};

/**
 * Validates event based on Joi schema
 * @param schema
 * @param options
 */
export const eventValidator = (schema: SchemaLike, options?: ValidationOptions) => ({
  before(handler: IHandlerLambda, next: IMiddyNextFunction) {
    const _options = Object.assign({}, defaultOptions, options);
    const event = attempt(handler.event, schema, undefined, _options);
    Object.assign(handler.event, event);
    next();
  }
});
