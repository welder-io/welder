// TODO: remove this entire horrible mess and implement a simplified
// version of linken that covers only our use case.

const fs = require('fs');
const path = require('path');

const linken = require('linken').linken;

module.exports = function(opts) {
  var dir = opts.cwd;
  if (!dir) {
    throw new Error('You must specify a directory.');
  }
  // TODO: this should not be nessesary, fix linken
  var cwd = process.cwd();
  // not the best heuristic in the world, but running
  // link from within a project repo should force running
  // from the parent directory
  if (fs.existsSync(path.resolve(dir, './package.json'))) {
    dir = path.join(dir, '..');
  }
  process.chdir(dir);
  
  linken([dir], fs.readdirSync(dir), {
    log: function() {},
    moduleDir: opts.moduleDir,
    src: [dir],
    types: [opts.dependencyKey]
  });
  process.chdir(cwd);
};
