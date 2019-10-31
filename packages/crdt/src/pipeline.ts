import sizeof from 'object-sizeof';
import { Atom, Id, Operation } from './types';

type PipelineReducer = () => any;
type PipelineMapper = () => any;

const operationSort = (a: Operation<any>, b: Operation<any>) => {
  return a.id.timestamp.time > b.id.timestamp.time ||
    (a.id.timestamp.time === b.id.timestamp.time &&
      a.id.timestamp.count > b.id.timestamp.count)
    ? 1
    : 0;
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
