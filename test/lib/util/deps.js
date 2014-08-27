const expect = require('chai').expect;

const deps = require('../../../lib/util/deps');

const helpers = require('../../helpers');
const config = require('../../fixtures/config');

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

});
