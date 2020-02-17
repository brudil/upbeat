// const setupWs = async () => {
//   const data = await fetch('http://localhost:8010/live', {
//     method: 'post',
//     credentials: 'include',
//   }).then((res) => res.json());
//
//   const w = new WebSocket(`${conf.uri}?token=${data.payload.token}`);
//   w.onmessage = function(data: any) {
//     const event = JSON.parse(data.data);
//     emitter.emit(event.type, event);
//   };
//
//   w.onclose = () => {
//     ws = null;
//     setTimeout(() => setupWs().then((newWs) => (ws = newWs)), 2000);
//   };
//
//   return w;
// };
//
// const checkAuth = async () => {
//   const auth = await fetch('http://localhost:8010/session', {
//     method: 'post',
//     credentials: 'include',
//   }).then((res) => res.json());
//   if (auth.payload.authenticated) {
//     store.produce((draft) => {
//       draft.auth.isAuthenticated = true;
//       draft.auth.loading = false;
//       draft.auth.credentials = auth.credidentials;
//     });
//     ws = await setupWs();
//   } else {
//     store.produce((draft) => {
//       draft.auth.loading = false;
//       draft.auth.isAuthenticated = false;
//     });
//   }
// };
