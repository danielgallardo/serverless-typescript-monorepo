import {IHandlerLambda, IMiddyNextFunction} from 'middy';
import {SchemaLike, ValidationOptions} from 'joi';
import {attempt} from '../validation';

const defaultOptions = {
  stripUnknown: true
};

export const eventValidator = (schema: SchemaLike, options?: ValidationOptions) => ({
  before(handler: IHandlerLambda, next: IMiddyNextFunction) {
    const _options = Object.assign({}, defaultOptions, options);
    const event = attempt(handler.event, schema, undefined, _options);
    Object.assign(handler.event, event);
    next();
  }
});
