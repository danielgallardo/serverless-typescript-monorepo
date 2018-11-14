import {NoteModel} from '../lib/NoteModel';

type Params = {
  userId: string;
};

export const listNotes = async ({userId}: Params) => {
  return NoteModel.query(userId).loadAll().execAsync();
};
