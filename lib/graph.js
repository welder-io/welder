const path = require('path');
const link = require('./util/link');

module.exports = function(cwd) {
  // read package.json in specified cwd
  var meta = require(path.resolve(cwd, 'package'));

  // ensure all repos are symlinked together
  link({cwd: cwd});

  // calculate gitfuse metadata for current path;
  // then trace all dependencies
  return this.depState({cwd: cwd}, meta)
    .then(this.deptrace.graph.bind(this.deptrace));
};
