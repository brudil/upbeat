import { RTServiceServer } from './core/Server';
import { EphemeralOperationsModule } from './modules/eop';

const service = new RTServiceServer({
  modules: [EphemeralOperationsModule],
});

service.listen(8009);
