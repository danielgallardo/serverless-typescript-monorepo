import bunyan from 'bunyan';
import dynogels from 'dynogels-promisified';
import {getEnv, Joi} from '../../lib/validation';

dynogels.AWS.config.update({region: getEnv('AWS_REGION')});

// tslint:disable-next-line:variable-name
const Model = dynogels.define('NotesTable', {
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
  log: bunyan.createLogger({name: 'NotesTable'})
});

export class NoteModel extends Model {
  /**
   * List all items
   */
  public static listAsync() {
    return super.scan().loadAll().execAsync();
  }
}
