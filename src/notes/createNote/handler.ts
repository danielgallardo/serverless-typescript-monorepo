import middy from 'middy';
import {apiRequestRoutine} from '../../lib/middlewares/apiRequestRoutine';
import {logRoutine} from '../../lib/middlewares/logRoutine';
import {Joi} from '../../lib/validation';
import {createNote} from './createNote';
import {NormalizedEvent} from '../../@types';
import {eventValidator} from '../../lib/middlewares/eventValidator';

interface Event extends NormalizedEvent {
  pathParameters: {
    userId: string;
  };
  body: {
    title: string;
    body: string;
  };
}

const schema = {
  pathParameters: Joi.object().keys({
    userId: Joi.param()
  }),
  body: Joi.object()
    .keys({
      title: Joi.string().required(),
      body: Joi.string().required()
    })
    .options({stripUnknown: false})
};

const handler = async (event: Event) => {
  return createNote({
    title: event.body.title,
    body: event.body.body,
    userId: event.pathParameters.userId
  });
};

export default middy(handler)
  .use(apiRequestRoutine())
  .use(eventValidator(schema))
  .use(logRoutine());
