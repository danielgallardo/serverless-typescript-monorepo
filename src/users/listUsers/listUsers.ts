import {UserModel} from '../lib/UserModel';

export const listUsers = async () => {
  return UserModel.scan().loadAll().execAsync();
};
