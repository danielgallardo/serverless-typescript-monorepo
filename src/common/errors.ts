// @ts-ignore
import joiErrorFormatter from 'joi-error-formatter';
import {ValidationError} from 'joi';

export type JoiErrorOptions = {
  errorPrefix?: string;
  internal?: boolean;
};

export class JoiError extends Error {
  isJoi: boolean;
  internal: boolean;
  details: object[];
  _object: object;

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
