import {NotesTable} from '../lib/notesTable';

type Params = {
  userId: string;
  noteId: string;
};

export const deleteNote = async ({userId, noteId}: Params) => {
  await NotesTable.destroyAsync(userId, noteId);
  return {
    statusCode: 204
  }
};
