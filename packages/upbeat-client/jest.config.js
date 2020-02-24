const base = require('../../jest.config.base');

const packageName = require('./package.json').name;
const dirName = packageName.replace('@withcue/', 'cue-').replace('@upbeat/', 'upbeat-');

module.exports = {
  ...base,
  name: dirName,
  displayName: packageName,
  roots: [
    `<rootDir>/packages/${dirName}`,
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
  ],
  setupFiles: [
  "fake-indexeddb/auto"
  ]
};
