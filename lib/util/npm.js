const exec = require('./exec');
const promise = require('./promise');

module.exports = {
  execInstall: execInstall,
  which: promise.promisify(require('which'))
};

function execInstall(cwd, opts) {
  opts = opts || {};
  var command = 'npm install';
  if (opts.ignore_scripts) {
    command += ' --ignore-scripts';
  }
  return exec(command, {cwd: cwd});
}
