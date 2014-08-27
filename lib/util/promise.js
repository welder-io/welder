const bluebird = require('bluebird');
const cpuCount = require('os').cpus().length;

const promise = module.exports = bluebird;

promise.prototype = Object.create(bluebird.prototype);

promise.prototype.parallel = function(fn, opts) {
  opts = opts || {};
  if (!opts.concurrency) {
    opts.concurrency = cpuCount;
  }
  return this.map(fn, opts);
};

promise.parallel = function(tasks) {
  return promise.resolve(tasks).parallel(function(task) {
    return task.call();
  });
};
