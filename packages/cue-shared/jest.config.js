const base = require('../../jest.config.base');

const packageName = require('./package.json').name.split('@withcue/').pop()

module.exports = {
  ...base,
  name: packageName,
  displayName: packageName,
  roots: [
    `<rootDir>/packages/${packageName}`,
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
  ],
};
