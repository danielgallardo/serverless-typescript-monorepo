import {UsersTable} from '../lib/usersTable';

export const listUsers = async () => {
  const users = await UsersTable.scan().execAsync();
  return users;
};
