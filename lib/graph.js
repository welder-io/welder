const path = require('path');

const link = require('./util/link');

module.exports = function(cwd) {
  // ensure all repos are symlinked together
  link({cwd: cwd});

  // find local package
  var meta = require(path.resolve(cwd, 'package'));

  // find package in registry
  return this.find(meta.name).then(function(registryEntry) {
    meta.registryEntry = registryEntry;
    return this.depState({
      cwd: cwd,
      name: meta.name,
      registryEntry: registryEntry,
      isRoot: true
    });
  }.bind(this)).then(function(state) {
    meta.gitfuse = state;
    return this.deptrace.graph(meta);
  }.bind(this));
};
