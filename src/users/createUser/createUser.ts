import {UsersTable} from '../lib/usersTable';

type Params = {
  name: string;
  email: string;
};

export const createUser = async (data: Params) => {
  // Check dynogels and dynogels-promisified for mor info about Table methods
  const user = await UsersTable.createAsync(data);
  return user.toJSON();
};
