declare module 'error-to-json' {
  export type JSONError = {
    name: string;
    message: string;
    stack?: string[];
    [key: string]: any;
  };

  function errorToJSON(error: Error): JSONError;

  export default errorToJSON;
}
