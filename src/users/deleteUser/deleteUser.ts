import {NoteModel} from '../../lib/models/NoteModel';
import {UserModel} from '../../lib/models/UserModel';

type Params = {
  userId: string;
};

export const deleteUser = async ({userId}: Params) => {
  // check if there are notes for this user
  const notes = await NoteModel.query(userId).limit(1).execAsync();

  if (notes.Count > 0) {
    // if there are notes fot his user send a 422 Unprocessable Entity Errpr
    return {
      statusCode: 422
    }
  } else {
    // else destroy the user and return a 204 empty response
    await UserModel.destroyAsync(userId);
    return {
      statusCode: 204
    }
  }
};
