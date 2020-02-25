import { createType, TypeDefinition } from '../utils';
import { Resource } from '@upbeat/schema/src';
import { getHandlersForType } from '../index';

interface MapAppAtom {}

export interface MapIntermediateAtom {
  properties: {
    [key: string]: unknown;
  };
}

type MapOperations = { type: 'SELECT'; property: string };

/**
 * MapType for applying operations to a typed map.
 */
export const MapType: TypeDefinition<
  'MAP',
  MapIntermediateAtom,
  MapAppAtom,
  MapOperations
> = createType('MAP', {
  apply(atom, operation) {
    if (operation.atomOperation.type === 'SELECT') {
      return [true, { ...atom }];
    }

    return [false, atom];
  },
  realise(property, schema: Resource) {
    return Object.fromEntries(
      Object.entries(property.properties).map(([key, value]) => [
        key,
        getHandlersForType(schema.properties[key].type).realise(
          value as any,
          schema.properties[key],
        ),
      ]),
    );
  },
  create(resource: Resource) {
    return {
      properties: Object.fromEntries(
        Object.entries(resource.properties).map(([prop, value]) => [
          prop,
          getHandlersForType(value.type).create(value),
        ]),
      ),
    };
  },
});
