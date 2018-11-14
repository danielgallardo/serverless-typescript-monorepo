import {UserModel} from '../../lib/models/UserModel';

export const listUsers = async () => {
  return UserModel.scan().loadAll().execAsync();
};
