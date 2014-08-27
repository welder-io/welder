const promise = require('./promise');
const exec = require('child_process').exec;

module.exports = function(command, opts) {
  return new promise(function(resolve) {
    opts = opts || {};
    exec(command, opts, function(err, stdout) {
      var code = 0;
      if (err) {
        code = err.code;
      }
      if (code !== 0) {
        //console.log('Failed to run ' + command);
        //console.log(err);
      }
      resolve({
        output: stdout,
        code: code
      });
    });
  });
};
