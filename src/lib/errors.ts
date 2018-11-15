import {ValidationError} from 'joi';
// @ts-ignore
import joiErrorFormatter from 'joi-error-formatter';

export type JoiErrorOptions = {
  errorPrefix?: string;
  internal?: boolean;
};

/**
 * Custom Joi error to simplify CloudWatch logging
 */
export class JoiError extends Error {
  public isJoi: boolean;
  public internal: boolean;
  public details: object[];
  // tslint:disable-next-line:variable-name
  public _object: object;

  constructor(joiError: ValidationError, {errorPrefix, internal}: JoiErrorOptions = {}) {
    let message = joiErrorFormatter(joiError);
    if (errorPrefix) message = `${errorPrefix}: ${message}`;
    super(message);
    this.name = joiError.name;
    this.isJoi = true;
    this.internal = internal || false;
    this.details = joiError.details;
    this._object = joiError._object;
    Error.captureStackTrace(this, this.constructor);
  }
}
