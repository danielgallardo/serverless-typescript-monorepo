import middy from 'middy';
import {INormalizedEvent} from '../../@types';
import {apiRequestRoutine} from '../../lib/middlewares/apiRequestRoutine';
import {eventValidator} from '../../lib/middlewares/eventValidator';
import {logRoutine} from '../../lib/middlewares/logRoutine';
import {Joi} from '../../lib/validation';
import {listNotes} from './listNotes';

interface IEvent extends INormalizedEvent {
  pathParameters: {
    userId: string;
  };
}

const schema = {
  pathParameters: Joi.object().keys({
    userId: Joi.param(),
  })
};

const handler = async (event: IEvent) => {
  return listNotes({userId: event.pathParameters.userId});
};

export default middy(handler)
  .use(apiRequestRoutine())
  .use(eventValidator(schema))
  .use(logRoutine());
