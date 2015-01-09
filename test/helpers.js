const fs = require('fs');

const rimraf = require('rimraf').sync;

const config = require('./fixtures/config');

const Welder = require('../');

const fuse = new Welder({
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
