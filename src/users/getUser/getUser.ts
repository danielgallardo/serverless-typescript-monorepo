import {usersTable} from '../lib/usersTable';

type Params = {
  userId: string;
};

export const getUser = async ({userId}: Params) => {
      const user = await usersTable.getAsync(userId);
      return user.toJSON();
};
