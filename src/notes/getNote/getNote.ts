import {NoteModel} from '../../lib/models/NoteModel';
import {getItem} from '../../lib/modelUtils';

type Params = {
  userId: string;
  noteId: string;
};

export const getNote = async ({userId, noteId}: Params) => {
  return getItem(NoteModel, userId, noteId);
};
