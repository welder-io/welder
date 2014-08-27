const promise = require('./util/promise');

module.exports = function() {
  var registry = this.registry;
  if (typeof registry === 'function') {
    registry = this.registry();
  }
  return promise.resolve(registry);
};
