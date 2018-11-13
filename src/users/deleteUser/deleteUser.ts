import {UsersTable} from '../lib/usersTable';

type Params = {
  userId: string;
};

export const deleteUser = async ({userId}: Params) => {
  await UsersTable.destroyAsync(userId);
  return {
    statusCode: 204
  }
};
