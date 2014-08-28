const path = require('path');

const link = require('./util/link');

module.exports = function(dir) {
  // ensure all repos are symlinked together
  link({dir: dir});

  // find local package
  var meta = require(path.resolve(dir, 'package'));

  // find package in registry
  return this.find(meta.name).then(function(registryEntry) {
    meta.registryEntry = registryEntry;
    return this.depState({
      cwd: dir,
      name: meta.name,
      registryEntry: registryEntry,
      isRoot: true
    });
  }.bind(this)).then(function(state) {
    meta.gitfuse = state;
    return this.deptrace.graph(meta);
  }.bind(this));
};
