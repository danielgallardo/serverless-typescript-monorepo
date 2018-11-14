import bunyan from 'bunyan';
import dynogels from 'dynogels-promisified';
import {getEnv, Joi} from '../../lib/validation';

dynogels.AWS.config.update({region: getEnv('AWS_REGION')});

// tslint:disable-next-line:variable-name
const Model = dynogels.define('UsersTable', {
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

  log: bunyan.createLogger({name: 'UsersTable'})
});

// This is a simplest way to add custom methods to a Model
// all methods should be static, new  UserModel() will return an Item
// see https://github.com/clarkie/dynogels#saving-models-to-dynamodb

export class UserModel extends Model {
  /**
   * List all items
   */
  public static listAsync() {
    return super.scan().loadAll().execAsync();
  }
}
