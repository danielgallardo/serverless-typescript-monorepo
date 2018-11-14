import {Model} from 'dynogels-promisified';
import {NotFound} from 'http-errors';
import {capitalize} from './utils';

/**
 * Gets an item from dynamoDB table
 * Throws a NotFound http error if item is not found
 * This is an example of functional approach to extending dynogels model functionality
 * @param model - dynogels Model
 */
export const getItem = (model: Model) => {
  return async (hashKey: string, rangeKey?: string) => {
    const item = await model.getAsync(hashKey, rangeKey);
    if (!item) {
      throw new NotFound(`${capitalize(model.config().name)} not found`);
    }
    return item;
  };
};
