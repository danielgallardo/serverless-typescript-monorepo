import {postEcho} from './postEcho';

process.env.CURRENT_STAGE = 'dev';
process.env.AWS_REGION = 'eu-west-1';

describe('postEcho', () => {
  it('should return correct response', () => {
    return expect(postEcho({message: 'Some message'})).resolves.toMatchSnapshot();
  });
});
