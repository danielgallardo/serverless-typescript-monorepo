import {notesTable} from '../lib/notesTable';

type Params = {
  userId: string;
  title: string;
  body: string;
};

export const createNote = async (data: Params) => {
  return notesTable.createAsync(data);
};
