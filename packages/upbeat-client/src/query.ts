/**
 * @packageDocumentation
 * @module @upbeat/client/query
 */

/*
 * Due to the local-first, quick nature of Upbeat apps, we don't fully support
 * joins etc.
 * We would use the inner component to perform follow up queries, but this
 * would be expected to be absolutely fine in terms of performance due to all
 * queries running locally, with no network IO. In the future, queries could be
 * batched.
 * */

import { UpbeatResource } from '../../upbeat-types/src';

class InvalidQueryError extends Error {}

enum OrderByDirection {
  ASC,
  DESC,
}

enum WhereComparator {
  Equals,
}

export interface OrderByConstraint {
  name: 'ORDERBY';
  direction: OrderByDirection;
  property: string;
}

export interface WhereConstraint {
  name: 'WHERE';
  property: string;
  value: unknown;
  comparator: WhereComparator;
}

export interface AllConstraint {
  name: 'ALL';
}

export type Constraints = AllConstraint | OrderByConstraint | WhereConstraint;
export type ConstraintsIds = Constraints['name'];

export type SerialisedQuery = [string, Constraints[]];

const SELECTORS = ['ALL', 'GET'];
const ORDER = ['ORDERBY'];
const PAGINATE = ['LIMIT'];

export class QueryBuilder<T> {
  private structure: Constraints[] = [];
  private resourceName: string;

  constructor(resourceName: string) {
    this.resourceName = resourceName;
  }

  private countConstraintsOf(names: string[]) {
    return this.structure.reduce(
      (count, constraint) =>
        names.includes(constraint.name) ? count + 1 : count,
      0,
    );
  }

  private valid(): string[] {
    const issues: string[] = [];

    if (this.countConstraintsOf(SELECTORS) !== 0) {
      issues.push('Multiple selectors within query: ALL & GET');
    }

    if (
      this.countConstraintsOf(PAGINATE) > 0 &&
      this.countConstraintsOf(ORDER) <= 0
    ) {
      issues.push('Paginate requires an order');
    }

    return issues;
  }

  where<P extends keyof T>(
    property: P,
    value: T[P],
    comparator: WhereComparator = WhereComparator.Equals,
  ) {
    this.structure.push({
      name: 'WHERE',
      property: property as string,
      comparator,
      value,
    });

    return this;
  }
  orderBy<P extends keyof T>(
    property: P,
    direction: OrderByDirection = OrderByDirection.ASC,
  ) {
    this.structure.push({
      name: 'ORDERBY',
      direction: direction,
      property: property as string,
    });

    return this;
  }

  all() {
    this.structure.push({
      name: 'ALL',
    });

    return this;
  }

  one() {
    this.structure.push({
      name: 'ALL',
    });

    return this;
  }

  build(): SerialisedQuery {
    if (!this.valid()) {
      throw new InvalidQueryError();
    }

    return [this.resourceName, this.structure];
  }
}

export const Query = {
  resource<T extends UpbeatResource>(resourceName: T['_type']) {
    return new QueryBuilder<T>(resourceName);
  },
  Direction: OrderByDirection,
  Comparator: WhereComparator,
};
