const cpuCount = require('os').cpus().length;

const promise = module.exports = require('bluebird/js/main/promise')();

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

promise.resultOf = function(value) {
  if (typeof value === 'function') {
    value = value();
  }
  return promise.resolve(value);
};
