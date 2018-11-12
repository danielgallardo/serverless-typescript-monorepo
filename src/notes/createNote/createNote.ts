import {NotesTable} from '../lib/notesTable';

type Params = {
  userId: string;
  title: string;
  body: string;
};

export const createNote = async (data: Params) => {
  const note = await NotesTable.createAsync(data);
  return note.toJSON();
};
