import {assert, attempt, getEnv, Joi} from './validation';

// define env variables for your test at the top
process.env.AWS_REGION = 'eu-west-1';

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
    expect(getEnv('AWS_REGION')).toBe('eu-west-1');
    expect(getEnv('MISSING_VAR', 'foo')).toBe('foo');
  });

  it('getEnv should throw error if variable is not defined', () => {
    const spy = jest.spyOn(console, 'log');
    expect(getEnv.bind(null, 'MISSING_VAR')).toThrowErrorMatchingSnapshot();
    expect(spy.mock.calls[0][0]).toBe('== MISSING ENV VARIABLE: "MISSING_VAR" ==');
  });

  it('Joi.param should correctly validate query and path parameters', () => {
    const schema = Joi.object().keys({
      userId: Joi.param()
    });
    expect(assert.bind(null, {userId: 'undefined'}, schema)).toThrowErrorMatchingSnapshot();
    expect(assert.bind(null, {userId: 'null'}, schema)).toThrowErrorMatchingSnapshot();
  });
});
