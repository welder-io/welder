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
    return this.depState(
      { isRoot: true, gitfuse: { cwd: cwd } },
      _.extend(meta, { registryEntry: dep })
    );
  }.bind(this)).then(this.deptrace.graph.bind(this.deptrace));
};
