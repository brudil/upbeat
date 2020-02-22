import { isLaterTimestamp } from '@upbeat/core/src/timestamp';
import { createType } from '../utils';
import { ResourceOperation } from '../../operations';

/**
 * LastWriteWins type supports LWW updates for primitives. Used within Maps
 */
const LWWType = createType<
  string,
  { type: 'String'; operation: ResourceOperation<any> }
>({
  application: (resource, operation) => {
    if (
      !resource?.properties[operation.property]?.operation ||
      isLaterTimestamp(
        operation.timestamp,
        resource.properties[operation.property].operation.timestamp,
      )
    ) {
      return [
        true,
        {
          ...resource,
          properties: {
            ...resource.properties,
            [operation.property]: {
              ...resource.properties[operation.property],
              operation,
            },
          },
        },
      ];
    }

    return [false, resource];
  },
  realise: (property) => {
    return property?.operation?.value;
  },
});
