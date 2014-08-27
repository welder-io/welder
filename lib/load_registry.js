const promise = require('./util/promise');

module.exports = function() {
  return promise.resultOf(this.registry);
};
