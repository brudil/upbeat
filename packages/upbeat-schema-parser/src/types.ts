export interface Type {
  identifier: string;
  subtype: Type | null;
}

export interface Property {
  identifier: string;
  type: Type;
}

export interface Resource {
  identifier: string;
  properties: { [propName: string]: Property };
}

export interface Space {
  identifier: string;
  properties: { [propName: string]: Property };
}

export interface Schema {
  resources: { [resourceName: string]: Resource };
  spaces: { [spaceName: string]: Space };
}

export type Scope =
  | { type: 'RESOURCE'; value: Resource }
  | { type: 'SPACE'; value: Space };
