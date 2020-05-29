/**
 * @packageDocumentation
 * @module @upbeat/types
 */

export type UpbeatOp = (...args: unknown[]) => unknown;

export interface UpbeatApp {
  operations: {};
}

export type UpbeatId = string;

export type UpbeatString = 'STRING';
export type UpbeatBoolean = 'BOOL';
export type UpbeatReference<R> = R;
export type UpbeatOrderable = number;
export type UpbeatSet<S> = { v: S[]; name: 'SET' };
export interface UpbeatResource {
  _type: string;
  tombstone?: boolean;
}

export type ChangesetType<T> = T extends UpbeatSet<infer X>
  ? { add?: ChangesetType<X>[]; remove?: ChangesetType<X>[] }
  : T extends UpbeatBoolean
  ? boolean
  : T extends UpbeatString
  ? string
  : T extends UpbeatOrderable
  ? number
  : T extends UpbeatReference<unknown>
  ? UpbeatId
  : T;

export type RealisedType<T> = T extends UpbeatSet<infer X>
  ? X[]
  : T extends UpbeatBoolean
  ? boolean
  : T extends UpbeatString
  ? string
  : T extends UpbeatOrderable
  ? number
  : T extends UpbeatReference<infer Y>
  ? Y
  : T;

export type ChangesetResource<T> = {
  [P in keyof T]: ChangesetType<T[P]>;
};

export type RealisedResource<T> = {
  [P in keyof T]: RealisedType<T[P]>;
};

// interface UpbeatType {
//   _type: "UpbeatType"
// }

// interface UpbeatGrowSet extends UpbeatType {
//   type: "set"
// }

// interface UpbeatText extends UpbeatType {
//   type: "text"
// }

// type UpbeatTypes = UpbeatSet;

// const createLWWMap = () => ({
//   type: 'lwwmap',
// });

// // rundown
// // - list of: items
// //   - items contain: columns (text/numbers), relations to: scripts/other objects

// /*
// rundown: {
//   items: [
//     {
//       id,
//       itemId,
//       name,
//       notes,
//       timeExpected,
//       addional: {
//         x,y,z
//       }
//     }
//   ]
// }
// */

// const rundown = createEntityContainer('rundown');
// const rundownItem = createCRDTEntity('rundownItem', );
