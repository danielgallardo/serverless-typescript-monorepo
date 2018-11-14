import {UserModel} from '../../lib/models/UserModel';
import {getItem} from '../../lib/modelUtils';

type Params = {
  userId: string;
};

export const getUser = async ({userId}: Params) => {
  return getItem(UserModel, userId);
};
