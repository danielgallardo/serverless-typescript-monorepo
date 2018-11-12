import env from 'env-var';
import _Joi, {Root, SchemaLike, StringSchema, ValidationOptions} from 'joi';
import {JoiError} from './errors';
import {errorToJSON, logDebugInfo, logError, logInfo} from './logger';

export interface IJoi extends Root {
  /**
   * Use this validation for queryParameters and pathParameters
   * to avoid undefined and null strings passed from front-end
   */
  param(): this;
  /**
   * Use this validation for unix timestamps in milliseconds
   * it will not convert value to date
   * use Joi.date().timestamp() to automatically convert value to date
   */
  timestamp(): this;
}

export interface ValidationConfig extends ValidationOptions {
  internal?: boolean;
}

export const Joi = _Joi.extend([
  {
    name: 'param',
    base: _Joi
      .string()
      .not('undefined', 'null')
      .required()
  },
  {
    name: 'timestamp',
    base: _Joi
      .date()
      .timestamp()
      .raw()
  }
]) as IJoi;

/**
 * Attempts to return a valid value, if value is invalid throws a JoiError
 * @param value - a value to validate
 * @param schema - Joi schema
 * @param errorPrefix - a sting that is prepended to error message
 * @param options - Joi validation options
 */
export function attempt<T>(
  value: T,
  schema: SchemaLike,
  errorPrefix?: string,
  options: ValidationConfig = {}
): T {
  const {internal, ...joiOptions} = options;
  const result = Joi.validate<T>(value, schema, joiOptions);
  if (result.error) {
    throw new JoiError(result.error, {errorPrefix, internal});
  }
  return result.value;
}

/**
 * Asserts that value is valid, if value is invalid throws a JoiError
 * @param value - a value to validate
 * @param schema - Joi schema
 * @param errorPrefix - a sting that is prepended to error message
 * @param options - Joi validation options
 */
export function assert<T>(
  value: T,
  schema: SchemaLike,
  errorPrefix?: string,
  options: ValidationConfig = {}
): void {
  const {internal, ...joiOptions} = options;
  const result = Joi.validate<T>(value, schema, joiOptions);
  if (result.error) {
    throw new JoiError(result.error, {errorPrefix, internal});
  }
}

/**
 * Gets and validates process.env variable
 * @param name
 * @param defaultValue
 */
export function getEnv(name: string, defaultValue?: string): string {
  try {
    if (defaultValue) return env.get(name, defaultValue).asString();
    return env
      .get(name)
      .required()
      .asString();
  } catch (error) {
    // we need to log an error right away in case getEnv is used outside lambda handler
    // otherwise we'll get only "module initialization error: EnvVarError"
    console.log(`== MISSING ENV VARIABLE: "${name}" ==`, JSON.stringify(errorToJSON(error)));
    throw error;
  }
}
