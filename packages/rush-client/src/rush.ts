// import { Patch, produceWithPatches } from 'immer';
//
// type Cb = (data: Object) => void;
//
// export interface RushInstance {
//   operation(event: object): void;
//   getState(): any;
//   subscribe(eventType: string, cb: Cb): void;
//   storeSubscribe(cb: Cb): () => void;
// }
//
// export interface Store {
//   entities: {};
//   transactions: [];
//   auth: {
//     isAuthenticated: boolean;
//     credentials: null | {};
//     loading: boolean;
//   };
// }
//
// const createRushStore = () => {
//   const subscriptions = new Map();
//   const patches: Patch[] = [];
//   const inversePatches: Patch[] = [];
//
//   let store = {
//     entities: {},
//     transactions: [],
//     auth: {
//       isAuthenticated: true,
//       loading: false,
//       credentials: null,
//     },
//   };
//
//   return {
//     getState: () => store,
//     subscribe(callback: Cb) {
//       const id = Symbol('subscription id');
//       subscriptions.set(id, callback);
//
//       return () => subscriptions.delete(id);
//     },
//     produce(draft: (a: Store) => void) {
//       const [
//         nextState,
//         producedPatches,
//         producedInversePatches,
//       ] = produceWithPatches(store, draft);
//       store = nextState;
//       patches.concat(producedPatches);
//       inversePatches.concat(producedInversePatches);
//
//       Array.from(subscriptions.values()).forEach((cb) => cb(nextState));
//     },
//   };
// };
//
// export const createRush = (): RushInstance => {
//   const store = createRushStore();
//
//   const subscriptions: {
//     [key: string]: Cb[];
//   } = {};
//
//   const ws = new WebSocket('ws://localhost:3000?token=x7x7x7');
//   ws.onmessage = function(data: any) {
//     const event = JSON.parse(data.data);
//     console.log(subscriptions, event);
//     if (subscriptions.hasOwnProperty(event.type)) {
//       subscriptions[event.type].forEach((cb) => cb(event));
//     }
//   };
//   // manages auth; transport layer; subscriptions.
//
//   const checkAuth = async () => {
//     const auth = await fetch('http://localhost:3001/session', {
//       method: 'get',
//     }).then((res) => res.json());
//     if (auth.authenticated) {
//       store.produce((draft) => {
//         draft.auth.isAuthenticated = true;
//         draft.auth.loading = false;
//         draft.auth.credentials = auth.credidentials;
//       });
//     } else {
//       store.produce((draft) => {
//         draft.auth.loading = false;
//       });
//     }
//   };
//
//   checkAuth();
//
//   return {
//     operation(event) {
//       ws.send(JSON.stringify(event));
//     },
//     getState() {
//       return store.getState();
//     },
//     storeSubscribe: store.subscribe,
//     subscribe(eventType, cb) {
//       if (!subscriptions.hasOwnProperty(eventType)) {
//         subscriptions[eventType] = [cb];
//       } else {
//         subscriptions[eventType].push(cb);
//       }
//     },
//   };
// };
