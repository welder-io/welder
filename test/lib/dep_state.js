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
      return fuse.depState(
        { isRoot: true, gitfuse: { cwd: testRepoOne } },
        _.extend(meta, { registryEntry: dep })
      );
    }).then(function(state) {
      var graph = _.cloneDeep(config.depGraph);
      delete graph.nodes;
      delete graph.label;
      expect(state).to.deep.equal(graph);
    });
  });

});
