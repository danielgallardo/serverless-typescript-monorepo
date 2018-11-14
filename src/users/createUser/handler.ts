import middy from 'middy';
import {apiRequestRoutine} from '../../lib/middlewares/apiRequestRoutine';
import {logRoutine} from '../../lib/middlewares/logRoutine';
import {Joi} from '../../lib/validation';
import {INormalizedEvent} from '../../@types';
import {eventValidator} from '../../lib/middlewares/eventValidator';
import {createUser} from './createUser';

// As a convention handler should not contain any business logic
// it only uses middlewares for common logic like event validation, error handing etc.
// we use middy middleware engine for that purpose

// Pass params to your action explicitly so this action can be reused with other handler
// like AppSync resolver for example

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

const handler = async (event: INormalizedEvent) => {
  // event.body will be an object parsed by apiRequestRoutine
  // and it will contain props that match the schema provided to eventValidator
  return createUser(event.body);
};

export default middy(handler)
  .use(apiRequestRoutine())
  .use(eventValidator(schema))
  .use(logRoutine());
