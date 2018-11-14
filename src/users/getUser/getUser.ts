import {usersTable} from '../lib/usersTable';

type Params = {
  userId: string;
};

export const getUser = async ({userId}: Params) => {
  return usersTable.getAsync(userId);
};
