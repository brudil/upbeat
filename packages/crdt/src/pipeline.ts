import sizeof from 'object-sizeof';
import { Atom, Id, Operation } from './types';
import { CharOperationTypes } from './structures/string';

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

  const operations: Operation<any>[] = [];

  const idMap = new Map<Id | null, Atom>();
  idMap.set(null, operationTree);

  const failedOperations: Operation<any>[] = [];

  const getSize = () => sizeof({ operationTree, idMap });

  let data: string = '';
  let idCache: Id[] = [];

  const assembleCache = () => {
    let chars: string[] = [];
    let ids: Id[] = [];

    ids.push(operationTree.operation.id);

    const tree = (atoms: Atom[]) => {
      atoms.forEach((atom) => {
        if (atom.operation.value.type === CharOperationTypes.DELETE) {
          chars.pop();
          ids.pop();
        } else {
          chars = chars.concat(atom.operation.value.contents);
          ids.push(atom.operation.id);
        }

        tree(atom.children);
      });
    };

    tree(operationTree.children);

    data = chars.join('');
    idCache = ids;
  };
  console.log(idMap);
  assembleCache();

  return {
    ingress(operation: O) {
      if (idMap.has(operation.id)) {
        console.log('received duplicate operation, skipping');
        return;
      }

      operations.push(operation);
      if (idMap.has(operation.locationId)) {
        const atom = {
          operation,
          children: [],
        };

        idMap.set(operation.id, atom);
        idMap.get(operation.locationId).children.push(atom);
        idMap.get(operation.locationId).children.sort(operationSort);

        assembleCache();
      } else {
        console.log(`failed operation! requires`, operation.locationId);
        failedOperations.push(operation);
      }
    },
    getLocationIdAtIndex: (index: number) => {
      if (index > idCache.length) {
        return idCache[idCache.length - 1];
      }

      return idCache[index];
    },
    operationTree,
    getSize,
    getString() {
      return data;
    },
  };
};
