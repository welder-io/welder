const path = require('path');

const _ = require('lodash');

const deps = require('./util/deps');
const link = require('./util/link');
const pfs = require('./util/pfs');
const promise = require('./util/promise');

module.exports = function(dir) {
  // ensure all repos are symlinked together
  link({dir: dir});

  // check for shrinkwrap
  var meta = pfs
    .readFile(path.resolve(dir, 'welder-shrinkwrap.json'), 'utf8')
    .bind(this)
    .then(function(shrinkwrap) {
      return promise.resolve(shrinkwrap)
        .bind(this)
        .then(JSON.parse)
        .then(function(shrinkwrap) {
          var meta = {
            name: shrinkwrap.name,
            version: shrinkwrap.version,
            shrinkwrap: shrinkwrap,
          };
          var metaDeps = meta[this.dependencyKey] = {};
          (shrinkwrap[this.dependencyKey] || []).forEach(function(obj) {
            metaDeps[obj.name] = obj.version;
          });
          return meta;
        });
    }, function() {
      return pfs.readFile(path.resolve(dir, this.configurationFile), 'utf8')
        .then(JSON.parse);
    });

  // find package in registry
  return promise.resolve(meta)
    .bind(this)
    .tap(function(_meta) { meta = _meta; })
    .get('name')
    .then(this.find)
    .then(function(registryEntry) {
      meta.registryEntry = registryEntry;
      return deps.state({
        cwd: dir,
        version: meta.version,
        name: meta.name,
        registryEntry: registryEntry,
        isRoot: true
      });
    })
    .then(function(state) {
      meta.welder = state;
      return this.deptrace.graph(meta);
    });
};
