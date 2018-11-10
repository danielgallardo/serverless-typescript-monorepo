import middy from 'middy';
import {NormalizedEvent} from '../../@types';
import {apiRequestRoutine} from '../../common/middlewares/apiRequestRoutine';
import {eventValidator} from "../../common/middlewares/eventValidator";
import {logRoutine} from '../../common/middlewares/logRoutine';
import {Joi} from '../../common/validation';
import {postEcho} from './postEcho';

interface Event extends NormalizedEvent {
  body: {
    message: string
  };
}

const schema = {
  body: Joi.object().keys({
    message: Joi.string().required()
  })
};

const handler = (event: Event) => {
  return postEcho({
    message: event.body.message
  });
};

export default middy(handler)
  .use(apiRequestRoutine())
  .use(eventValidator(schema))
  .use(logRoutine());
