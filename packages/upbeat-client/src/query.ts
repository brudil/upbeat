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

/**
 * Enum for ORDERBY querying.
 */
enum OrderByDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

/**
 * Enum for Comparators within querying.
 */
enum WhereComparator {
  Equals = '=',
}

/**
 * ORDERBY. with property and direction support
 */
export interface OrderByConstraint {
  name: 'ORDERBY';
  direction: OrderByDirection;
  property: string;
}

/**
 * Where constraint supporting a COMPARATOR
 */
export interface WhereConstraint {
  name: 'WHERE';
  property: string;
  value: unknown;
  comparator: WhereComparator;
}

/**
 * Constraint for selecting all matching objects
 */
export interface AllConstraint {
  name: 'ALL';
}

export type Constraints = AllConstraint | OrderByConstraint | WhereConstraint;

export type ConstraintsIds = Constraints['name'];

/**
 * Serialised query containing multiple constraints and resource name.
 * Allows for communication with the Upbeat Worker.
 */
export type SerialisedQuery = [string, Constraints[]];

const SELECTORS = ['ALL', 'GET'];
const ORDER = ['ORDERBY'];
const PAGINATE = ['LIMIT'];

/**
 * Helper utility class for easily constructing queries.
 *
 * Requires passing in a resource schema for type safety.
 *
 * Fluent API, easy chaining.
 */
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

  /**
   * Validates a constructed query for running.
   */
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

  constraintToString(constraint: Constraints) {
    switch (constraint.name) {
      case 'ORDERBY':
        return `ORDER BY ${constraint.property}, ${constraint.direction}`;
      case 'WHERE':
        return `WHERE ${constraint.property} ${constraint.comparator} ${constraint.value}`;
      case 'ALL':
        return 'SELECT ALL';
    }
  }

  toString() {
    return `FROM ${this.resourceName} ${this.structure
      .map(this.constraintToString)
      .join(' ')}`;
  }

  /**
   * Builds with current query to a SerialisedQuery object.
   */
  build(): SerialisedQuery {
    if (!this.valid()) {
      throw new InvalidQueryError();
    }

    return [this.resourceName, this.structure];
  }

  static fromSerialised(serialisedQuery: SerialisedQuery) {
    const q = new QueryBuilder(serialisedQuery[0]);
    q.structure = serialisedQuery[1];

    return q;
  }
}

export const Query = {
  resource<T extends UpbeatResource>(resourceName: T['_type']) {
    return new QueryBuilder<T>(resourceName);
  },
  Direction: OrderByDirection,
  Comparator: WhereComparator,
};
