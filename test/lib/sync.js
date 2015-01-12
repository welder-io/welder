const fs = require('fs');
const path = require('path');

const rimraf = require('rimraf').sync;
const expect = require('chai').expect;

const config = require('../fixtures/config');
const helpers = require('../helpers');
const Welder = require('../../');

const git = require('../../lib/util/git');
const pfs = require('../../lib/util/pfs');

const fuse = new Welder({
  logLevel: 0,
  dependencyKey: 'gitfuseDependencies',
  registry: config.registry,
});

const testFoo = path.join(config.repoDir, config.registry[0].name);

describe('#sync', function() {

  this.timeout(60000);

  beforeEach(function() {
    return helpers.setup()
      .then(function() { return git.fetch(testFoo, 'origin', '0.2.0'); })
      .then(function() { return git.checkout(testFoo, '0.2.0'); });
  });

  it('should sync normally', function() {
    return fuse.sync(testFoo, {skipStatus: true})
      .then(function() { return fuse.graphTarget(testFoo); })
      .then(function(graph) {
        expect(graph).to.deep.equal(config.sync.expect);
      });
  });

  it('should sync from shrinkwrap', function() {
    var shrinkwrapPath = path.join(testFoo, 'welder-shrinkwrap.json');
    return pfs
      .writeFile(
        shrinkwrapPath,
        JSON.stringify(config.sync.fromShrinkwrap),
        'utf8'
      )
      .then(function() { return fuse.sync(testFoo, { skipStatus: true }); })
      .then(function() { return fuse.graphTarget(testFoo); })
      .then(function(graph) {
        expect(graph).to.deep.equal(config.sync.fromShrinkwrapExpect);
      });
  });

  it('fails to sync shrinkwrap with mismatched sha', function() {
    // Noop error to make event emitter happy.
    fuse.on('error', function() {});

    var shrinkwrapPath = path.join(testFoo, 'welder-shrinkwrap.json');
    return pfs
      .writeFile(
        shrinkwrapPath,
        JSON.stringify(config.sync.fromShrinkwrapBadSha),
        'utf8'
      )
      .then(function() { return fuse.sync(testFoo, { skipStatus: true }); })
      .then(function() { expect(false).to.be.ok(); })
      .catch(function(e) {
        expect(e.message).to
          .equal('Failed to verify shas of these packages: test-baz');
      });
  });

});
