const util = require('util');

const _ = require('lodash');

module.exports = function(name) {
  this.emit('debug', util.format('Looking for %s in registry...', name));
  return _.find(this.registry, { name: name });
};
