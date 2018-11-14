import {UserModel} from '../lib/UserModel';

type Params = {
  userId: string;
};

export const getUser = async ({userId}: Params) => {
  return UserModel.getAsync(userId);
};
