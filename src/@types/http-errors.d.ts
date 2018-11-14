declare module 'http-errors' {
  interface IHttpError extends Error {
    status: number;
    statusCode: number;
    expose: boolean;
    headers?: {
      [key: string]: string;
    };
    [key: string]: any;
  }

  type HttpErrorConstructor = new (msg?: string) => IHttpError;

  type CreateHttpError = (
    ...args: Array<Error | string | number | {[key: string]: any}>
  ) => IHttpError;

  type NamedConstructors = {
    [code: string]: HttpErrorConstructor;
    HttpError: HttpErrorConstructor;
    BadRequest: HttpErrorConstructor;
    Unauthorized: HttpErrorConstructor;
    PaymentRequired: HttpErrorConstructor;
    Forbidden: HttpErrorConstructor;
    NotFound: HttpErrorConstructor;
    MethodNotAllowed: HttpErrorConstructor;
    NotAcceptable: HttpErrorConstructor;
    ProxyAuthenticationRequired: HttpErrorConstructor;
    RequestTimeout: HttpErrorConstructor;
    Conflict: HttpErrorConstructor;
    Gone: HttpErrorConstructor;
    LengthRequired: HttpErrorConstructor;
    PreconditionFailed: HttpErrorConstructor;
    PayloadTooLarge: HttpErrorConstructor;
    URITooLong: HttpErrorConstructor;
    UnsupportedMediaType: HttpErrorConstructor;
    RangeNotSatisfiable: HttpErrorConstructor;
    ExpectationFailed: HttpErrorConstructor;
    ImATeapot: HttpErrorConstructor;
    MisdirectedRequest: HttpErrorConstructor;
    UnprocessableEntity: HttpErrorConstructor;
    Locked: HttpErrorConstructor;
    FailedDependency: HttpErrorConstructor;
    UnorderedCollection: HttpErrorConstructor;
    UpgradeRequired: HttpErrorConstructor;
    PreconditionRequired: HttpErrorConstructor;
    TooManyRequests: HttpErrorConstructor;
    RequestHeaderFieldsTooLarge: HttpErrorConstructor;
    UnavailableForLegalReasons: HttpErrorConstructor;
    InternalServerError: HttpErrorConstructor;
    NotImplemented: HttpErrorConstructor;
    BadGateway: HttpErrorConstructor;
    ServiceUnavailable: HttpErrorConstructor;
    GatewayTimeout: HttpErrorConstructor;
    HTTPVersionNotSupported: HttpErrorConstructor;
    VariantAlsoNegotiates: HttpErrorConstructor;
    InsufficientStorage: HttpErrorConstructor;
    LoopDetected: HttpErrorConstructor;
    BandwidthLimitExceeded: HttpErrorConstructor;
    NotExtended: HttpErrorConstructor;
    NetworkAuthenticationRequire: HttpErrorConstructor;
  };

  const createHttpError: CreateHttpError & NamedConstructors;
  export = createHttpError;
}
