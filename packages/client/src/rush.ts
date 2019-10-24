type Cb = (data: Object) => void;

const createClientRush = () => {
  const ws = new WebSocket('ws://localhost:3000');
  const subscriptions: {
    [key: string]: Cb[];
  } = {};
  ws.onmessage = function (data: any) {
    const event = JSON.parse(data.data);
    console.log(subscriptions, event);
    if (subscriptions.hasOwnProperty(event.type)) {
      subscriptions[event.type].forEach(cb => cb(event));
    }
  };


  return {
    send(event: Object) {
      ws.send(JSON.stringify(event));
    },
    subscribe(eventType: string, cb: Cb) {
      if (!subscriptions.hasOwnProperty(eventType)) {
        subscriptions[eventType] = [cb];
      } else {
        subscriptions[eventType].push(cb);
      }
    }
  }
};


export const rush = createClientRush();
