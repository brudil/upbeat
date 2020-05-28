/**
 * @packageDocumentation
 * @module @upbeat/schema
 */

export interface Type {
  identifier: string;
  subtype: Type | null;
}

export interface Property {
  identifier: string;
  type: Type;
}

export interface Key {
  identifier: string;
  identifiers: string[];
}

export interface Resource {
  identifier: string;
  properties: { [propName: string]: Property };
  keys: {
    [keyName: string]: Key;
  };
}

export interface Space {
  identifier: string;
  properties: { [propName: string]: Property };
}

export interface Schema {
  resources: { [resourceName: string]: Resource };
  spaces: { [spaceName: string]: Space };
}

export interface Type {
  identifier: string;
  nullable: boolean;
  subtype: null | Type;
}

export type Scope =
  | { type: 'RESOURCE'; value: Resource }
  | { type: 'SPACE'; value: Space };
