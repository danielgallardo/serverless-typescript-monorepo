import {UserModel} from '../lib/UserModel';

type Params = {
  userId: string;
};

export const deleteUser = async ({userId}: Params) => {
  await UserModel.destroyAsync(userId);
  return {
    statusCode: 204
  }
};
