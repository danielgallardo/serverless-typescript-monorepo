/* tslint:disable */
declare module 'dynamodb-data-types' {
  export interface AttributeValue {
    B?: string;
    BS?: string[];
    BOOL?: boolean;
    L?: AttributeValue[];
    M?: {[id: string]: AttributeValue};
    N?: string;
    NS?: string[];
    NULL?: boolean;
    S?: string;
    SS?: string[];
  }

  export interface IAttributeValue {
    unwrap(obj: {[key: string]: AttributeValue}): {[key: string]: any};
    wrap(obj: {[key: string]: any}): {[key: string]: AttributeValue};
  }

  export const AttributeValue: IAttributeValue;
}
