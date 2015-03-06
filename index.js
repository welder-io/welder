const EE = require('events').EventEmitter;
const util = require('util');

const Welder = module.exports = function Welder(opts) {
  opts = opts || {};

  this.concurrency = opts.concurrency || require('os').cpus().length;
  this.registry = opts.registry || [];
  this.moduleDir = opts.moduleDir || 'node_modules';
  this.configurationFile = opts.configurationFile || 'package.json';
  this.dependencyKey = opts.dependencyKey || 'dependencies';
  this.installCommand = opts.installCommand || 'npm install';
};
util.inherits(Welder, EE);

Welder.prototype.graphPrepare = require('./lib/graph').prepare;
Welder.prototype.graphActive = require('./lib/graph').active;
Welder.prototype.graphTarget = require('./lib/graph').target;
Welder.prototype.deptraceFor = require('./lib/deptrace_for');
Welder.prototype.find = require('./lib/find');
Welder.prototype.loadRegistry = require('./lib/load_registry');
Welder.prototype.requestFileFromGithub =
  require('./lib/util/github').requestFile;

Welder.prototype.init = require('./lib/init');
Welder.prototype.status = require('./lib/status');
Welder.prototype.shrinkwrap = require('./lib/shrinkwrap');
Welder.prototype.sync = require('./lib/sync');
Welder.prototype.version = require('./lib/version');
