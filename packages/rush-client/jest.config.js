const base = require('../../jest.config.base');

const packageName = require('./package.json').name.split('@assignar/').pop()

module.exports = {
  ...base,
  name: packageName,
  displayName: packageName
};
