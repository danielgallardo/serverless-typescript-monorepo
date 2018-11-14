import {Model} from 'dynogels-promisified';

/**
 * List all items in dynamoDB table
 * This is an example of functional approach to extending dynogels model functionality
 * This method is too short but you can imagine listPaginated that implements some sort of pagination
 * @param model - dynogels Model
 */
export const listAsync = (model: Model) => model.scan().loadAll().execAsync();
