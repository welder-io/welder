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
    // extract array of dependencies from a specified key in package.json
    depsFor: Deptrace.packageJson(this.dependencyKey),
    // find package.json for dependency and calculate gitfuse state
    resolve: function(dep, parents) {
      return github.packageJson(_.extend(dep, this.find(dep.name)))
        .then(this.depState.bind(this, parents[parents.length -1]));
    }.bind(this)
  });
};
util.inherits(Gitfuse, EE);

Gitfuse.prototype.init = require('./lib/init');
Gitfuse.prototype.find = require('./lib/find');
Gitfuse.prototype.depState = require('./lib/dep_state');
Gitfuse.prototype.graph = require('./lib/graph');
Gitfuse.prototype.status = require('./lib/status');
Gitfuse.prototype.sync = require('./lib/sync');
