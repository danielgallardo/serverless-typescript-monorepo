import bunyan from 'bunyan';
import dynogels from 'dynogels-promisified';
import {getEnv, Joi} from '../validation';

dynogels.AWS.config.update({region: getEnv('AWS_REGION')});

// tslint:disable-next-line:variable-name
export const NoteModel = dynogels.define('note', {
  tableName: getEnv('NOTES_TABLE'),
  hashKey: 'userId',
  rangeKey: 'id',
  timestamps: true,
  schema: {
    id: dynogels.types.uuid(),
    userId: Joi.string(),
    title: Joi.string(),
    body: Joi.string()
  },
  log: bunyan.createLogger({name: 'note'})
});
