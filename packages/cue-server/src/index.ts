require('dotenv').config();
import process from 'process';

process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(1);
});

if (process.env.CST === 'ub') {
  require('./entry/upbeat');
} else {
  require('./entry/api');
}
