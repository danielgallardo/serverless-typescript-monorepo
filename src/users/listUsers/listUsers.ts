import {usersTable} from '../lib/usersTable';

export const listUsers = async () => {
  return usersTable.scan().execAsync();
};
