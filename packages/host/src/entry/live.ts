// import Hapi from '@hapi/hapi';
import { pool } from '../setup/db';
import { createLiveManager } from '../liveManager';
console.log(`@withcue/host - WS Server`);
console.log(`listening at `, process.env.PORT);
console.log(pool);

const live = createLiveManager({
  async validateConnection() {
    return true;
  },
});

live.start(process.env.PORT || '');
