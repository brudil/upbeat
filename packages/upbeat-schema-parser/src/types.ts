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
  properties: Property[];
}

export interface Space {
  identifier: string;
  properties: Property[];
}

export interface Schema {
  resources: Resource[];
  spaces: Space[];
}
