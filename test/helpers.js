const fs = require('fs');

const rimraf = require('rimraf').sync;

const config = require('./fixtures/config');

const Gitfuse = require('../');

const fuse = new Gitfuse({
  httpsPublic: !!process.env.WELDER_PUBLIC_HTTPS,
  logLevel: 0,
  registry: config.registry,
  dependencyKey: 'gitfuseDependencies'
});

exports.clearRepos = function() {
  rimraf(config.repoDir);
  fs.mkdirSync(config.repoDir);
};

exports.setup = function() {
  exports.clearRepos();
  return fuse.init(config.repoDir);
};

Object.defineProperty(exports, 'httpsPublic', {
  get: function() { return !!process.env.WELDER_PUBLIC_HTTPS; },
});
