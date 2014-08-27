const _ = require('lodash');

const promise = require('./util/promise');

module.exports = function(name, registry) {
  this.emit('debug', 'Looking for ' + name + ' in registry...');
  if (!registry) {
    registry = this.loadRegistry();
  }
  return promise.resolve(registry).then(function(deps) {
    return _.find(deps, { name: name });
  });
};
