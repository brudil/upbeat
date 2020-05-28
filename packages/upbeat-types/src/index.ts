/**
 * @packageDocumentation
 * @module @upbeat/types
 */

export type UpbeatOp = (...args: unknown[]) => unknown;

export interface UpbeatApp {
  operations: {};
}

export type UpbeatId = string;

export type UpbeatString = string;
export type UpbeatBoolean = boolean;
export type UpbeatReference<R> = R;
export type UpbeatOrderable = number;
export type UpbeatSet<S> = S[];
export interface UpbeatResource {
  _type: string;
  tombstone?: boolean;
}

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
