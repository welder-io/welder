const path = require('path');

const _ = require('lodash');

const link = require('./util/link');

module.exports = function(cwd) {
  // ensure all repos are symlinked together
  link({cwd: cwd});

  // find local package
  var meta = require(path.resolve(cwd, 'package'));

  // find package in registry
  return this.find(meta.name).then(function(dep) {
    meta.registryEntry = dep;
    return this.depState({
      cwd: cwd,
      meta: meta,
      isRoot: true
    });
  }.bind(this)).then(function(state) {
    meta.gitfuse = state;
    return this.deptrace.graph(meta);
  }.bind(this));
};
