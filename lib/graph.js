const path = require('path');

const _ = require('lodash');

const deps = require('./util/deps');
const link = require('./util/link');
const pfs = require('./util/pfs');
const promise = require('./util/promise');

module.exports.prepare = prepareGraph;

module.exports.active = function(dir) {
  return prepareGraph.call(this, dir)
    .then(function(meta) {
      return this.deptraceFor({ localVersion: true }).graph(meta);
    });
};

module.exports.target = function(dir) {
  return prepareGraph.call(this, dir)
    .then(function(meta) {
      return this.deptraceFor().graph(meta);
    });
};

function shrinkwrapRootToGraphConfiguration(shrinkwrap) {
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
}

function parseConfigruationFile(dir) {
  return pfs
    .readFile(path.resolve(dir, this.configurationFile), 'utf8')
    .then(JSON.parse);
}

function getGraphConfiguration(dir) {
  return pfs
    // Check for shrinkwrap.
    .readFile(path.resolve(dir, 'welder-shrinkwrap.json'), 'utf8')
    .bind(this)
    .then(
      shrinkwrapRootToGraphConfiguration,
      // Read the local config file if a shrinkwrap is unavailable.
      parseConfigruationFile.bind(this, dir)
    );
}

function prepareGraphMeta(dir) {
  var meta;

  return getGraphConfiguration.call(this, dir)
    .bind(this)
    .tap(function(_meta) { meta = _meta; })
    .get('name')
    // Find package in registry.
    .then(this.find)
    .then(function(registryEntry) {
      meta.registryEntry = registryEntry;
      return {
        cwd: dir,
        version: meta.version,
        name: meta.name,
        registryEntry: registryEntry,
        isRoot: true
      };
    })
    .then(deps.state)
    .then(function(state) {
      meta.welder = state;
      return meta;
    });
}

function prepareGraph(dir) {
  return prepareGraphMeta.call(this, dir)
    // Ensure all repos are symlinked together.
    .tap(link.bind(null, { dir: dir }));
}
