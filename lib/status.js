const deps = require('./util/deps');

module.exports = function(dir) {
  return this.graphTarget(dir).then(deps.visualize).then(function(lines) {
    lines.forEach(function(line) {
      this.emit('write', line);
    }.bind(this));
  }.bind(this));
};
