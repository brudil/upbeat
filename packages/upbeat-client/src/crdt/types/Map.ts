import { createType } from '../utils';

interface MapAppAtom {}

interface MapIntermediateAtom {
  properties: {
    [key: string]: unknown;
  };
}

type MapOperations = { type: 'SELECTOR'; property: string };

/**
 * MapType for applying operations to a typed map.
 */
export const MapType = createType<
  MapIntermediateAtom,
  MapAppAtom,
  MapOperations,
  'MAP'
>('MAP', {
  apply(atom, operation) {
    if (operation.atomOperation.type === 'SELECTOR') {
      return [true, { ...atom }];
    }

    return [false, atom];
  },
  realise(property, handleType) {
    return Object.fromEntries(
      Object.entries(property.properties).map(([key, value]) => [
        key,
        handleType(value),
      ]),
    );
  },
  create() {
    return {
      properties: {},
    };
  },
});
