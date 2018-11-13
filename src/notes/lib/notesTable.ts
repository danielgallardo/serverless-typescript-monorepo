import dynogels from 'dynogels-promisified';
import {getEnv, Joi} from '../../lib/validation';

dynogels.AWS.config.update({region: getEnv('AWS_REGION')});

export const NotesTable = dynogels.define('NotesTable', {
  tableName: getEnv('NOTES_TABLE'),
  hashKey: 'userId',
  rangeKey: 'id',
  timestamps: true,
  schema: {
    id: dynogels.types.uuid(),
    userId: Joi.string(),
    title: Joi.string(),
    body: Joi.string()
  }
});
