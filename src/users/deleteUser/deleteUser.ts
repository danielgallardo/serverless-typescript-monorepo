import {NoteModel} from '../../lib/models/NoteModel';
import {UserModel} from '../../lib/models/UserModel';

type Params = {
  userId: string;
};

export const deleteUser = async ({userId}: Params) => {
  // check if there are notes for this user
  NoteModel.query(userId).limit(1).execAsync().then((data) => {
    if (data.Count > 0) {
      return {
        statusCode: 422
      }
    } else {
      // if any note for user then destroy it
      UserModel.destroyAsync(userId).then(() => {
        return {
          message: data.Count
        }
      });
    }
  });
};
