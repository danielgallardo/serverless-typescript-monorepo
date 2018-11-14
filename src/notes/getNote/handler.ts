import middy from 'middy';
import {INormalizedEvent} from '../../@types';
import {apiRequestRoutine} from '../../lib/middlewares/apiRequestRoutine';
import {eventValidator} from '../../lib/middlewares/eventValidator';
import {logRoutine} from '../../lib/middlewares/logRoutine';
import {Joi} from '../../lib/validation';
import {getNote} from './getNote';

interface IEvent extends INormalizedEvent {
  pathParameters: {
    userId: string;
    noteId: string;
  };
}

const schema = {
  pathParameters: Joi.object().keys({
    userId: Joi.param(),
    noteId: Joi.param()
  })
};

const handler = async (event: IEvent) => {
  return getNote({
    userId: event.pathParameters.userId,
    noteId: event.pathParameters.noteId
  });
};

export default middy(handler)
  .use(apiRequestRoutine())
  .use(eventValidator(schema))
  .use(logRoutine());
