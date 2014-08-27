const deps = require('./util/deps');

module.exports = function(cwd) {
  return this.graph(cwd).then(deps.visualize).then(function(lines) {
    lines.forEach(function(line) {
      this.emit('write', line);
    }.bind(this));
  }.bind(this));
};
