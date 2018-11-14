import middy from 'middy';
import {INormalizedEvent} from '../../@types';
import {apiRequestRoutine} from '../../lib/middlewares/apiRequestRoutine';
import {eventValidator} from '../../lib/middlewares/eventValidator';
import {logRoutine} from '../../lib/middlewares/logRoutine';
import {Joi} from '../../lib/validation';
import {getUser} from './getUser';

interface IEvent extends INormalizedEvent {
  // path parameter matches {userId} part of the url
  pathParameters: {
    userId: string;
  };
}

const schema = {
  pathParameters: Joi.object().keys({
    // this is a custom Joi method that insure that param is not undefined or null as a string
    // it returns an error if "/users/undefined" is called
    userId: Joi.param()
  })
};

const handler = async (event: IEvent) => {
  return getUser({userId: event.pathParameters.userId});
};

export default middy(handler)
  .use(apiRequestRoutine())
  .use(eventValidator(schema))
  .use(logRoutine());
