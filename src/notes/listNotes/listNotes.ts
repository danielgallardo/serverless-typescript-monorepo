import {notesTable} from '../lib/notesTable';

type Params = {
  userId: string;
};

export const listNotes = async ({userId}: Params) => {
  return notesTable.query(userId).loadAll().execAsync();
};
