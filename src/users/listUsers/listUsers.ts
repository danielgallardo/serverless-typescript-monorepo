import {UsersTable} from '../lib/usersTable';

type Params = {
  userId: string;
};

export const listUsers = async ({userId}: Params) => {
  const user = await UsersTable.getAsync(userId);
  return user.toJSON();
};
