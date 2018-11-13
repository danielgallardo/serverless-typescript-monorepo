import middy from 'middy';
import {apiRequestRoutine} from '../../lib/middlewares/apiRequestRoutine';
import {logRoutine} from '../../lib/middlewares/logRoutine';
import {Joi} from '../../lib/validation';
import {NormalizedEvent} from '../../@types';
import {eventValidator} from '../../lib/middlewares/eventValidator';
import {createUser} from './createUser';

const schema = {
  body: Joi.object()
    .keys({
      name: Joi.string().required(),
      email: Joi.string()
        .email()
        .required()
    })
    // if you pass this option validator will throw an error if any unknown key is passed
    // otherwise it will silently remove all unknown keys
    // read more about options: https://github.com/hapijs/joi/blob/v14.0.1/API.md#validatevalue-schema-options-callback
    .options({stripUnknown: false})
};

const handler = async (event: NormalizedEvent) => {
  return createUser(event.body);
};

export default middy(handler)
  .use(apiRequestRoutine())
  .use(eventValidator(schema))
  .use(logRoutine());
