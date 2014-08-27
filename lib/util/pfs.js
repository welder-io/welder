const fs = require('fs');
const promise = require('./promise');

// Manually promisifyAll since promisifyAll applies a suffix.
const pfs = module.exports = {};

for (var key in fs) {
  if (!/(Sync|Stream)$/.test(key) && typeof(fs[key]) === 'function') {
    pfs[key] = promise.promisify(fs[key], fs);
  }
}

// Return a promise that resolves to true or false of whether a file exists.
pfs.exists = function(path) {
  return pfs.stat(path)
    .then(function() { return true; })
    .catch(function() { return false; });
};

pfs.mkdirp = promise.promisify(require('mkdirp'));
