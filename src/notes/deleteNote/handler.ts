import middy from 'middy';
import {apiRequestRoutine} from '../../lib/middlewares/apiRequestRoutine';
import {logRoutine} from '../../lib/middlewares/logRoutine';
import {Joi} from '../../lib/validation';
import {deleteNote} from './deleteNote';
import {NormalizedEvent} from '../../@types';
import {eventValidator} from '../../lib/middlewares/eventValidator';

interface Event extends NormalizedEvent {
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

const handler = async (event: Event) => {
  return deleteNote({
    userId: event.pathParameters.userId,
    noteId: event.pathParameters.noteId
  });
};

export default middy(handler)
  .use(apiRequestRoutine())
  .use(eventValidator(schema))
  .use(logRoutine());
