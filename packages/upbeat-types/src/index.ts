export type UpbeatOp = (...args: unknown[]) => unknown;

export interface UpbeatApp {
  operations: {};
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
