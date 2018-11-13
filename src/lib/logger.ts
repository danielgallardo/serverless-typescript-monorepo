import toJSON from 'error-to-json';

export const logInfo = (...args: any[]): void => {
  const info = args.map(arg => {
    if (typeof arg === 'object') return JSON.stringify(arg, null, 2);
    return arg;
  });
  console.log(...info);
};

/**
 * Logs data when env "DEBUG" is set to true
 * @param args
 */
export const logDebugInfo = (...args: any[]): void => {
  if (process.env.DEBUG === 'true') logInfo(...args);
};

/**
 * Use this function to debug variables like
 * `logDebugVar({currentUser})` will output
 * `currentUser: {...}`
 * @param data - a variable wrapped in an object like {currentUser}
 */
export const logDebugObject = (data: {[key: string]: any}): void => {
  Object.keys(data).forEach(key => {
    logDebugInfo(key, data[key]);
  });
};

/**
 * Converts error to a JSON object
 * @param error
 */
export const errorToJSON = (error: Error) => {
  const jsonError = toJSON(error);
  if (error.stack) {
    const stack = error.stack.replace(/    /g, '');
    jsonError.stack = stack.split('\n');
  }
  return jsonError;
};

/**
 * Logs a formatted error that is readable in CloudWatch
 * @param error
 */
export const logError = (error: Error = new Error('empty error')): void => {
  // we don't want to log errors when we're testing, it pollutes test outputs
  if (process.env.NODE_ENV === 'test') return;
  logInfo('== ERROR ==', errorToJSON(error), null, 2);
};
