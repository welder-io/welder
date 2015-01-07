const exec = require('child_process').exec;

const _ = require('lodash');

const promise = require('./promise');

module.exports = function(command, opts) {
  return new promise(function(resolve) {
    opts = opts || {};
    exec(command, opts, function(err, stdout, stderr) {
      var code = 0;
      if (err) {
        code = err.code;
      }
      if (code !== 0 && opts.log) {
        opts.log('error', 'Failed to run ' + command);
        opts.log('error', stderr);
      }
      resolve({
        output: stdout,
        errorOutput: stderr,
        code: code
      });
    });
  });
};

module.exports.throwIfAnyExitedNonZero = function(results) {
  if (_.any(results, function(result) { return result.code; })) {
    log('error', 'Some commands did not exit normally.');
    throw new Error('Some commands did not exit normally.');
  }
};
