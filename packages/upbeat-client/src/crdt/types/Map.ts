import { createType } from '../utils';

interface MapAppAtom {}

interface MapIntermediateAtom {}

type MapOperations = { type: 'SELECTOR'; property: string };

/**
 * MapType for applying operations to a typed map.
 */
export const MapType = createType<
  MapIntermediateAtom,
  MapAppAtom,
  MapOperations
>({
  application(atom, operation) {
    if (operation.atomOperation.type === 'SELECTOR') {
      return [true, { ...atom }];
    }
  },
});
