import {usersTable} from '../lib/usersTable';

type Params = {
  name: string;
  email: string;
};

// Use named export, it improves autocompletion
export const createUser = async (data: Params) => {
  // Check dynogels and dynogels-promisified for mor info about Table methods
  return usersTable.createAsync(data);
};
