import bunyan from 'bunyan';
import dynogels from 'dynogels-promisified';
import {getEnv, Joi} from '../validation';

dynogels.AWS.config.update({region: getEnv('AWS_REGION')});

// name your model as a single item, this name will be used in helper methods
// to provide better errors
// tslint:disable-next-line:variable-name
export const UserModel = dynogels.define('user', {
  // Table name can be configured after initialization like this
  // Table.config({tableName: 'AccountsTable'});

  // getEnv method insures that env variable is defined
  // it will throw an error otherwise
  tableName: getEnv('USERS_TABLE'),
  hashKey: 'id',

  // add the timestamp attributes (updatedAt, createdAt)
  timestamps: true,

  // Joi schema of the table record
  schema: {
    id: dynogels.types.uuid(),
    name: Joi.string(),
    email: Joi.string().email()
  },

  log: bunyan.createLogger({name: 'user'})
});
