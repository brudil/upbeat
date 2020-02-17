/*
 * Due to the local-first, quick nature of Upbeat apps, we don't fully support
 * joins etc.
 * We would use the inner component to perform follow up queries.
 * */

export interface Query {
  resourceName: string;
  builder: QueryStructure;
}

type QueryStructure = any;

interface QueryBuilderOps {
  where(propertyName: string, propertyValue: any): QueryStructure;
  findId(id: string): QueryStructure;
}

interface Builder {
  (operations: QueryBuilderOps): QueryStructure | QueryStructure[];
}

function where(propertyName: string, propertyValue: any) {
  return {
    type: 'WHERE',
    propertyName,
    propertyValue,
  };
}

function findId(id: string) {
  return {
    type: 'FINDID',
    id,
  };
}

export function createQuery(resourceName: string, builder: Builder): Query {
  return {
    builder: builder({
      where,
      findId,
    }),
    resourceName,
  };
}
