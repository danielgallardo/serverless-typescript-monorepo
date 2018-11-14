import {notesTable} from '../lib/notesTable';

type Params = {
  userId: string;
  noteId: string;
};

export const getNote = async ({userId, noteId}: Params) => {
  return notesTable.getAsync(userId, noteId);
};
