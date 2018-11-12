import dynogels from 'dynogels-promisified';
import {getEnv, Joi} from '../../lib/validation';

dynogels.AWS.config.update({region: getEnv('AWS_REGION')});

export const UsersTable = dynogels.define('User', {
  //Table name can be configured after initialization like this
  //UsersTable.config({tableName: 'AccountsTable'});
  tableName: getEnv('USERS_TABLE'),
  hashKey: 'id',
  // add the timestamp attributes (updatedAt, createdAt)
  timestamps: true,
  schema: {
    id: dynogels.types.uuid(),
    name: Joi.string(),
    email: Joi.string().email()
  }
});
