export interface RushInstance {}

const createRushStore = () => {
  const store = {
    entities: {},
    transactions: [],
  };
};

export const createRush = (): RushInstance => {
  const store = createRushStore();

  // manages auth; transport layer; subscriptions.

  return {
    operation() {},
    read() {},
    subscribe() {
      // returns unsubscribe
    },
  };
};
