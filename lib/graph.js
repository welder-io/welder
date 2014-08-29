const path = require('path');

const link = require('./util/link');
const deps = require('./util/deps');

module.exports = function(dir) {
  // ensure all repos are symlinked together
  link({dir: dir});

  // find local package
  var meta = require(path.resolve(dir, 'package'));

  // find package in registry
  return this.find(meta.name).then(function(registryEntry) {
    meta.registryEntry = registryEntry;
    return deps.state({
      cwd: dir,
      version: meta.version,
      name: meta.name,
      registryEntry: registryEntry,
      isRoot: true
    });
  }.bind(this)).then(function(state) {
    meta.gitfuse = state;
    return this.deptrace.graph(meta);
  }.bind(this));
};
