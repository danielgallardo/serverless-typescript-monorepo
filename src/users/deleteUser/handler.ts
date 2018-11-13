import middy from 'middy';
import {apiRequestRoutine} from '../../lib/middlewares/apiRequestRoutine';
import {logRoutine} from '../../lib/middlewares/logRoutine';
import {Joi} from '../../lib/validation';
import {deleteUser} from './deleteUser';
import {NormalizedEvent} from '../../@types';
import {eventValidator} from '../../lib/middlewares/eventValidator';

interface Event extends NormalizedEvent {
  pathParameters: {
    userId: string;
  };
}

const schema = {
  pathParameters: Joi.object().keys({
    userId: Joi.param()
  })
};

const handler = async (event: Event) => {
  return deleteUser({userId: event.pathParameters.userId});
};

export default middy(handler)
  .use(apiRequestRoutine())
  .use(eventValidator(schema))
  .use(logRoutine());
