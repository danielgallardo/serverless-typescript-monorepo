import middy from 'middy';
import {NormalizedEvent} from '../../@types';
import {apiRequestRoutine} from '../../common/middlewares/apiRequestRoutine';
import {eventValidator} from "../../common/middlewares/eventValidator";
import {logRoutine} from '../../common/middlewares/logRoutine';
import {Joi} from '../../common/validation';
import {getGreeting} from './getGreeting';

interface Event extends NormalizedEvent {
  queryStringParameters: {
    name: string;
  };
}

const schema = {
  queryStringParameters: Joi.object().keys({
    name: Joi.param()
  })
};

const handler = (event: Event) => {
  return getGreeting({
    name: event.queryStringParameters.name
  });
};

export default middy(handler)
  .use(apiRequestRoutine())
  .use(eventValidator(schema))
  .use(logRoutine());
