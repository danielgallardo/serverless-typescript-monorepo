import middy from 'middy';
import {apiRequestRoutine} from '../../lib/middlewares/apiRequestRoutine';
import {logRoutine} from '../../lib/middlewares/logRoutine';
import {Joi} from '../../lib/validation';
import {listUsers} from './listUsers';
import {NormalizedEvent} from '../../@types';
import {eventValidator} from '../../lib/middlewares/eventValidator';

interface Event extends NormalizedEvent {
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

const handler = async () => {
  return listUsers();
};

export default middy(handler)
  .use(apiRequestRoutine())
  // .use(eventValidator(schema))
  .use(logRoutine());
