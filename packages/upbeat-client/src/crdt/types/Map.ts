import { createType, CRDTType } from '../utils';
import { Resource } from '@upbeat/schema/src';
import { getHandlersForType } from '../index';

export interface MapIntermediateAtom {
  properties: {
    [key: string]: unknown;
  };
}

export type MapOperations = { type: 'SELECT'; property: string };

/**
 * MapType for applying operations to a typed map.
 */
export const MapType: CRDTType<
  'MAP',
  MapIntermediateAtom,
  {},
  MapOperations
> = createType('MAP', {
  apply(atom, operation, next) {
    if (operation.atomOperation.type === 'SELECT') {
      return [
        true,
        {
          properties: {
            ...atom.properties,
            [operation.atomOperation.property]: next(
              atom.properties[operation.atomOperation.property],
            ),
          },
        },
      ];
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
