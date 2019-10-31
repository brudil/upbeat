import sizeof from 'object-sizeof';
import { Atom, Id, Operation } from './types';

type PipelineReducer = () => any;
type PipelineMapper = () => any;

const operationSort = (aAtom: Atom, bAtom: Atom): number => {
  const a = aAtom.operation;
  const b = bAtom.operation;

  // if time is bigger, we're sorted lads
  if (a.id.timestamp.time > b.id.timestamp.time) {
    return -1;
  }

  // if we're matched on time, let's see if the counts differ.
  if (
    a.id.timestamp.time === b.id.timestamp.time &&
    a.id.timestamp.count > b.id.timestamp.count
  ) {
    return -1;
  }

  // if time and counters are matched, we fall to site id.
  if (
    a.id.timestamp.time === b.id.timestamp.time &&
    a.id.timestamp.count === b.id.timestamp.count &&
    a.id.siteId > b.id.siteId
  ) {
    return -1;
  }

  // if none of these are bigger, it's probs time to admit that b is bigger.
  return 1;
};

export const createPipelineType = <O extends Operation<any>>(
  reducer: PipelineReducer,
  mapper: PipelineMapper,
) => () => {
  const operationTree: Atom = {
    children: [],
    operation: {
      value: null,
      locationId: null,
      id: {
        siteId: '0',
        timestamp: {
          time: 0,
          count: 0,
        },
      },
    },
  };
  const idMap = new Map<Id, Atom>();
  idMap.set(null, operationTree);

  const getSize = () => sizeof({ operationTree, idMap });

  return {
    ingress(operation: O) {
      const atom = {
        operation,
        children: [],
      };

      idMap.set(operation.id, atom);
      idMap.get(operation.locationId).children.push(atom);
      // sort children

      console.log(Math.round(getSize() / 1024), 'KB');
    },
    getLocationIdAtIndex: (index: number) => null,
    operationTree,
  };
};
