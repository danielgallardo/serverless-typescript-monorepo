import {UsersTable} from '../lib/usersTable';

type Params = {
  name: string;
  email: string;
};

export const createUser = async (data: Params) => {
  const user = await UsersTable.createAsync(data);
  return user.toJSON();
};
