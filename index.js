const EE = require('events').EventEmitter;
const util = require('util');

const _ = require('lodash');
const Deptrace = require('deptrace');

const github = require('./lib/util/github');

const Gitfuse = module.exports = function Gitfuse(opts) {
  opts = opts || {};

  this.registry = opts.registry || [];
  this.concurrency = opts.concurrency || require('os').cpus().length;
  this.moduleDir = opts.moduleDir || 'node_modules';
  this.dependencyKey = opts.dependencyKey || 'dependencies';
  this.deptrace = new Deptrace({
    setup: function() {
      // get registry once for the duration of each graphing run
      // this is pretty hack, but it's likely safe to assume
      // the registry won't change rapidly enough to ever matter
      return this.loadRegistry().then(function(registry) {
        this.registryResolved = registry;
      }.bind(this));
    }.bind(this),
    // extract array of dependencies from a specified key in package.json
    depsFor: Deptrace.packageJson(this.dependencyKey),
    // resolve each dependency to a more complete representation
    resolve: function(dep, parents) {
      // find dependency in registry
      return this.find(dep.name, this.registryResolved)
        // add data from package.json on github
        .then(github.packageJson)
        // add state from local machine
        .then(function(meta) {
          var parent = parents[parents.length -1];
          return this.depState({
            cwd: parent.gitfuse.cwd,
            name: meta.name,
            registryEntry: meta.registryEntry,
            version: parent[this.dependencyKey][meta.name]
          }).then(function (state) {
            meta.gitfuse = state;
            return meta;
          }.bind(this));
        }.bind(this));
    }.bind(this)
  });
};
util.inherits(Gitfuse, EE);

Gitfuse.prototype.init = require('./lib/init');
Gitfuse.prototype.depState = require('./lib/dep_state');
Gitfuse.prototype.graph = require('./lib/graph');
Gitfuse.prototype.status = require('./lib/status');
Gitfuse.prototype.sync = require('./lib/sync');
Gitfuse.prototype.find = require('./lib/find');
Gitfuse.prototype.loadRegistry = require('./lib/load_registry');
Gitfuse.prototype.requestFileFromGithub =
  require('./lib/util/github').requestFile;
