import {
  createPool
} from 'slonik';
import {
  createInterceptors
  // TODO: Write def file
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
} from 'slonik-interceptor-preset';

export const pool = createPool('postgres://cuedev', {
  interceptors: [...createInterceptors()]
});
