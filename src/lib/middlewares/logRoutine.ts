import {IHandlerLambda, IMiddyNextFunction} from 'middy';
import {logDebugInfo, logError} from '../logger';

/**
 * Logs event and response when env "DEBUG" is set to true
 * Logs formatted error that occurred in handler
 */
export const logRoutine = () => ({
  before(handler: IHandlerLambda, next: IMiddyNextFunction) {
    logDebugInfo('Event', handler.event);
    next();
  },
  after(handler: IHandlerLambda, next: IMiddyNextFunction) {
    logDebugInfo('Response', handler.response);
    next();
  },
  onError(handler: IHandlerLambda, next: IMiddyNextFunction) {
    logError(handler.error);
    next(handler.error);
  }
});
