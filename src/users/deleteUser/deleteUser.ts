import {UsersTable} from '../lib/usersTable';

type Params = {
  id: string
};

export const deleteUser = async (data: Params) => {
  const user = await UsersTable.destroyAsync(data);
  return user.toJSON();
};
