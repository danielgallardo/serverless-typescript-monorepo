import {Model} from 'dynogels-promisified';
import {NotFound} from 'http-errors';

/**
 * Gets an item from dynamoDB table
 * Throws a NotFound http error if item is not found
 * This is an example of functional approach to extending dynogels model functionality
 * @param model - dynogels Model
 * @param hashKey
 * @param rangeKey
 */
export const getItem = async (model: Model, hashKey: string, rangeKey?: string) => {
  const item = await model.getAsync(hashKey, rangeKey);
  if (!item) throw new NotFound('Item not found');
  return item;
};
