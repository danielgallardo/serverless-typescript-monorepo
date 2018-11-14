import {NoteModel} from '../../lib/models/NoteModel';

type Params = {
  userId: string;
  title: string;
  body: string;
};

export const createNote = async (data: Params) => {
  return NoteModel.createAsync(data);
};
