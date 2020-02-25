// import {createType} from "../utils";
//
// export interface SetAddOperation<V> {
//   type: 'ADD';
//   value: V;
// }
//
// export interface SetRemoveOperation<V> {
//   type: 'REMOVE';
//   value: V;
// }
//
// export type SetOperations<T> =
//   | SetAddOperation<T>
//   | SetRemoveOperation<T>;
//
// export const SetType = createType<{}, {}, SetOperations<unknown>, 'Set'>('Set', {
//   apply(intermediate, operation) {
//
//   },
//   realise(property, handleType) {
//
//   },
//   create() {
//     return {
//       addOps: []
//     }
//   }
// });
