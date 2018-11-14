import middy from 'middy';
import { apiRequestRoutine } from '../../lib/middlewares/apiRequestRoutine';
import { logRoutine } from '../../lib/middlewares/logRoutine';
import { listUsers } from './listUsers';

const handler = async () => {
  return listUsers();
};

export default middy(handler)
  .use(apiRequestRoutine())
  // .use(eventValidator(schema))
  .use(logRoutine());
