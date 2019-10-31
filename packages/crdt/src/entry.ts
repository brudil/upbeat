import { createClient } from './client';
import { createClientManager } from './clientManager';

const manager = createClientManager();
const james = createClient();
const al = createClient();
const fran = createClient();
const andy = createClient();

manager.addClient(james);
manager.addClient(al);
manager.addClient(fran);
manager.addClient(andy);

james.insertCharAt(0, 'j');
james.insertCharAt(0, 'a');
james.insertCharAt(0, 'm');
james.insertCharAt(0, 'e');
james.insertCharAt(0, 's');
