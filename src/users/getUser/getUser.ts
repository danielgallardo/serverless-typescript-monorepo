import {UsersTable} from '../lib/usersTable';

type Params = {
  userId: string;
};

export const getUser = async ({userId}: Params) => {
  const user = await UsersTable.getAsync(userId);
  return user.toJSON();
};
