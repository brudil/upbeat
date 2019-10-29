type Cb = (data: Object) => void;

export interface RushInstance {
  operation(event: object): void;
  read(): any;
  subscribe(eventType: string, cb: Cb): void;
}

const createRushStore = () => {
  const store = {
    entities: {},
    transactions: [],
  };

  return store;
};

export const createRush = (): RushInstance => {
  const store = createRushStore();
  const subscriptions: {
    [key: string]: Cb[];
  } = {};
  const ws = new WebSocket('ws://localhost:3000');
  ws.onmessage = function(data: any) {
    const event = JSON.parse(data.data);
    console.log(subscriptions, event);
    if (subscriptions.hasOwnProperty(event.type)) {
      subscriptions[event.type].forEach((cb) => cb(event));
    }
  };
  // manages auth; transport layer; subscriptions.

  return {
    operation(event) {
      ws.send(JSON.stringify(event));
    },
    read() {
      return store;
    },
    subscribe(eventType, cb) {
      if (!subscriptions.hasOwnProperty(eventType)) {
        subscriptions[eventType] = [cb];
      } else {
        subscriptions[eventType].push(cb);
      }
    },
  };
};
