const base = require('./jest.config.base');

module.exports = {
  projects: [ '<rootDir>/packages/*/jest.config.js'],
  coverageDirectory: '<rootDir>/coverage/',
  collectCoverageFrom: [
    '<rootDir>/packages/*/src/**/*.{ts,tsx}',
  ]
};
