const path = require('path');

const expect = require('chai').expect;

const deps = require('../../../lib/util/deps');

const helpers = require('../../helpers');
const config = require('../../fixtures/config');

const testRepoOne = path.resolve(config.repoDir, config.registry[0].name);

describe('deps', function() {

  this.timeout(20000);

  before(function() {
    return helpers.setup();
  });

  describe('::findConflicts', function() {
    it('should find conflicts in a dependency graph', function() {
      expect(deps.findConflicts(config.depGraph))
        .to.deep.equal(['test-qux']);
    });
  });

  describe('::visualize', function() {
    it('should visualize a dependency tree', function() {
      expect(deps.visualize(config.depGraph))
        .to.deep.equal(config.depVisualize);
    });
  });

  describe('::state', function() {
    it('should calculate the status of a repository', function() {
      var meta = require(path.join(testRepoOne, 'package'));
      return deps.state({
        cwd: testRepoOne,
        name: meta.name,
        version: meta.version,
        registryEntry: require('../../fixtures/registry')[0],
        isRoot: true
      }).then(function(state) {
        expect(state).to.deep.equal(config.depGraph.gitfuse);
      });
    });
  })

});
