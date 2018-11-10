import {getGreeting} from './getGreeting';

describe('getGreeting', () => {
  it('should return correct greeting', () => {
    return expect(getGreeting({name: 'John'})).resolves.toMatchSnapshot();
  });
});
