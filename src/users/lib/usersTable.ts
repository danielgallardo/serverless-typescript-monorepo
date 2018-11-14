import bunyan from 'bunyan';
import dynogels from 'dynogels-promisified';
import {getEnv, Joi} from '../../lib/validation';

dynogels.AWS.config.update({region: getEnv('AWS_REGION')});

export const usersTable = dynogels.define('UsersTable', {
  // Table name can be configured after initialization like this
  // UsersTable.config({tableName: 'AccountsTable'});

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

  log: bunyan.createLogger({name: 'UsersTable'})
});
