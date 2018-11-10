import {assert, attempt, getEnv, Joi} from './validation';

const schema = Joi.object().keys({
  foo: Joi.string().required()
});

describe('validation', () => {
  it('attempt should return correct value', () => {
    expect(attempt({foo: 'bar'}, schema)).toEqual({foo: 'bar'});
  });

  it('attempt throw error if value is incorrect', () => {
    expect(attempt.bind(null, {foo: 1}, schema, 'Validation test')).toThrowErrorMatchingSnapshot();
  });

  it('assert should not throw error if value is valid', () => {
    expect(assert.bind(null, {foo: 'bar'}, schema)).not.toThrow();
  });

  it('assert throw error if value is incorrect', () => {
    expect(assert.bind(null, {}, schema, 'Validation test')).toThrowErrorMatchingSnapshot();
  });

  it('getEnv should return env variable', () => {
    expect(getEnv('NODE_ENV')).toBe('test');
    expect(getEnv('MISSING_VAR', 'foo')).toBe('foo');
  });

  it('getEnv should throw error if variable is not defined', () => {
    const spy = jest.spyOn(console, 'log');
    expect(getEnv.bind(null, 'MISSING_VAR')).toThrowErrorMatchingSnapshot();
    expect(spy.mock.calls[0]).toMatchSnapshot();
  });

  it('Joi.param should correctly validate query and path parameters', () => {
    const schema = Joi.object().keys({
      userId: Joi.param()
    });
    expect(assert.bind(null, {userId: 'undefined'}, schema)).toThrowErrorMatchingSnapshot();
    expect(assert.bind(null, {userId: 'null'}, schema)).toThrowErrorMatchingSnapshot();
  });
});
