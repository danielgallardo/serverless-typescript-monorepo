import {UserModel} from '../../lib/models/UserModel';
import {getItem} from '../../lib/modelUtils';

type Params = {
  userId: string;
};

export const getUser = async ({userId}: Params) => {
  // As a convention use pure functions to extend dynogels functionality
  return getItem(UserModel, userId);
};
