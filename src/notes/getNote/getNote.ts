import {NoteModel} from '../../lib/models/NoteModel';

type Params = {
  userId: string;
  noteId: string;
};

export const getNote = async ({userId, noteId}: Params) => {
  return NoteModel.getAsync(userId, noteId);
};
