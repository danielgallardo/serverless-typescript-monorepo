import {NotesTable} from '../lib/notesTable';

type Params = {
  userId: string;
  noteId: string
};

export const getNote = async ({userId, noteId}: Params) => {
  const note = await NotesTable.getAsync(userId, noteId);
  return note.toJSON();
};
