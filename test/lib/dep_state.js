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

describe('#depState', function() {

  this.timeout(20000);
  
  before(function() {
    return helpers.setup();
  });

  it('should calculate the status of a repository', function() {
    return fuse.depState({
      gitfuse: {
        cwd: testRepoOne
      }
    }, require(path.join(testRepoOne, 'package'))).then(function(state) {
      expect(state).to.exist;
    });
  });

});
