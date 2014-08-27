const path = require('path');
const expect = require('chai').expect;

const config = require('../fixtures/config');
const helpers = require('../helpers');

const Gitfuse = require('../../');

const fuse = new Gitfuse({
  logLevel: 0,
  registry: config.registry,
  dependencyKey: 'gitfuseDependencies'
});

const testRepoOne = path.resolve(config.repoDir, config.registry[0].name);

describe('#graph', function() {

  this.timeout(20000);

  before(function() {
    return helpers.setup();
  });

  it('should perform a networked dependency graph', function() {
    return fuse.graph(testRepoOne).then(function(graph) {
      expect(JSON.stringify(graph))
        .to.deep.equal(JSON.stringify(config.depGraph));
    });
  });

});
