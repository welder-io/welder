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
        var cwd = opts.cwd || process.cwd();
        opts.log('error', 'Failed to run `' + command + '` (cwd: ' + cwd + ')');
        opts.log('error', stderr);
      }
      resolve({
        command: command,
        opts: opts,
        output: stdout,
        errorOutput: stderr,
        code: code
      });
    });
  });
};

module.exports.throwIfAnyExitedNonZero = function(results, log) {
  var failed = _.filter(results, function(result) { return result.code; });
  if (failed.length > 0) {
    var failedMessages = failed.map(function(result) {
      var cwd = result.opts.cwd || process.cwd();
      return '- ' + result.command + '\n  (cwd: ' + cwd + ')';
    }).join('\n').split('\n');
    log('error', 'The following commands failed to run:');
    failedMessages.forEach(function(msg) {
      log('error', msg);
    });
    throw new Error('Some commands did not exit normally.');
  }
  return results;
};

module.exports.warnIfAnyExitedNonZero = function(results, log) {
  var failed = _.filter(results, function(result) { return result.code; });
  if (failed.length > 0) {
    var failedMessages = failed.map(function(result) {
      var cwd = result.opts.cwd || process.cwd();
      return '- ' + result.command + '\n  (cwd: ' + cwd + ')';
    }).join('\n').split('\n');
    log('warn', 'The following commands failed to run:');
    failedMessages.forEach(function(msg) {
      log('warn', msg);
    });
  }
  return results;
};
