const path = require('path');

const expect = require('chai').expect;
const _ = require('lodash');

const config = require('../fixtures/config');
const helpers = require('../helpers');

const Gitfuse = require('../../');

const fuse = new Gitfuse({
  logLevel: 0,
  registry: config.registry,
  dependencyKey: 'gitfuseDependencies'
});

const testRepoOne = path.resolve(config.repoDir, config.registry[0].name);

describe('#depState', function() {

  this.timeout(20000);

  before(function() {
    return helpers.setup();
  });

  it('should calculate the status of a repository', function() {
    var meta = require(path.resolve(testRepoOne, 'package'));
    return fuse.find(meta.name).then(function(dep) {
      meta.registryEntry = dep;
      return fuse.depState({
        cwd: testRepoOne,
        meta: meta,
        isRoot: true
      });
    }).then(function(state) {
      expect(state).to.deep.equal(config.depGraph.gitfuse);
    });
  });

});
