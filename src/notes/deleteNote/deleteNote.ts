import {NoteModel} from '../../lib/models/NoteModel';

type Params = {
  userId: string;
  noteId: string;
};

export const deleteNote = async ({userId, noteId}: Params) => {
  await NoteModel.destroyAsync(userId, noteId);
  return;
};
