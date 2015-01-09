const EE = require('events').EventEmitter;
const util = require('util');

const _ = require('lodash');
const Deptrace = require('deptrace');

const github = require('./lib/util/github');
const deps = require('./lib/util/deps');

const Welder = module.exports = function Welder(opts) {
  opts = opts || {};

  this.concurrency = opts.concurrency || require('os').cpus().length;
  this.registry = opts.registry || [];
  this.moduleDir = opts.moduleDir || 'node_modules';
  this.configurationFile = opts.configurationFile || 'package.json';
  this.dependencyKey = opts.dependencyKey || 'dependencies';
  this.installCommand = opts.installCommand || 'npm install';

  this.deptrace = new Deptrace({
    setup: function() {
      // get registry once for the duration of each graphing run
      // this is pretty hack, but it's likely safe to assume
      // the registry won't change rapidly enough to ever matter
      return this.loadRegistry().then(function(registry) {
        this.registryResolved = registry;
      }.bind(this));
    }.bind(this),
    // extract array of dependencies from configuration
    depsFor: Deptrace.packageJson(this.dependencyKey),
    // resolve each dependency to a more complete representation
    resolve: function(dep, parents) {
      // find dependency in registry
      return this.find(dep.name, this.registryResolved)
        .then(function(registryEntry) {
          var config = this.configurationFile;
          // find config file on github
          return github.requestFile(registryEntry, config)
            .then(JSON.parse)
            .then(function (json) {
              // save registryEntry data on configuration file
              json.registryEntry = registryEntry;
              return json;
            }).catch(function() {
              throw new Error(
                'Unable to find ' + config + ' for ' + registryEntry.name
              );
            });
        }.bind(this))
        // add state from local machine
        .then(function(meta) {
          var parent = parents[parents.length -1];
          return deps.state({
            cwd: parent.welder.cwd,
            name: meta.name,
            registryEntry: meta.registryEntry,
            version: parent[this.dependencyKey][meta.name]
          }).then(function (state) {
            meta.welder = state;
            return meta;
          });
        }.bind(this));
    }.bind(this)
  });
};
util.inherits(Welder, EE);

Welder.prototype.init = require('./lib/init');
Welder.prototype.graph = require('./lib/graph');
Welder.prototype.status = require('./lib/status');
Welder.prototype.sync = require('./lib/sync');
Welder.prototype.find = require('./lib/find');
Welder.prototype.loadRegistry = require('./lib/load_registry');
Welder.prototype.requestFileFromGithub =
  require('./lib/util/github').requestFile;
