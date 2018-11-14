import {UnprocessableEntity} from 'http-errors';
import {NoteModel} from '../../lib/models/NoteModel';
import {UserModel} from '../../lib/models/UserModel';

type Params = {
  userId: string;
};

export const deleteUser = async ({userId}: Params) => {
  // check if there are notes for this user
  const notes = await NoteModel.query(userId)
    .limit(1)
    .execAsync();

  if (notes.Count > 0) {
    // you can throw http-errors directly inside your handler
    // apiRequestRoutine will transform it to an error response for the client
    throw new UnprocessableEntity('User has notes, please delete them first');
  }

  await UserModel.destroyAsync(userId);

  // an empty response will return 204 No content to the client
  return;
};
