import toJSON from 'error-to-json';

export const logInfo = (comment: string, data?: object): void => {
  console.log(`${comment}:`, JSON.stringify(data, null, 2));
};

export const logDebugInfo = (comment: string, data?: object): void => {
  if (process.env.DEBUG === 'true') {
    logInfo(comment, data);
  }
};

/**
 * use this function to debug variables like
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

export const logError = (error: Error = new Error('empty error')): void => {
  // we don't want to log errors when we're testing, it pollutes test outputs
  if (process.env.NODE_ENV === 'test') return;
  console.log('== ERROR ==', JSON.stringify(errorToJSON(error), null, 2));
};
