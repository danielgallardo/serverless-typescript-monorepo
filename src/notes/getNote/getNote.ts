import {notesTable} from '../lib/notesTable';

type Params = {
  userId: string;
  noteId: string;
};

export const getNote = async ({userId, noteId}: Params) => {
  const note = await notesTable.getAsync(userId, noteId);
  return note.toJSON();
};
