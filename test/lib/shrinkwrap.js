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
  registry: config.registry,
  dependencyKey: 'gitfuseDependencies',
});
fuse.on('error', console.error.bind(console));

const testFoo = path.join(config.repoDir, config.registry[0].name);

describe('#shrinkwrap', function() {

  this.timeout(60000);

  before(function() {
    return helpers.setup()
      .then(function() { return git.fetch(testFoo, 'origin', '0.2.0'); })
      .then(function() { return git.checkout(testFoo, '0.2.0'); })
      .then(function() { return fuse.sync(testFoo, {skipStatus: true}); });
  });

  it('should shrinkwrap dependencies', function() {
    return fuse.shrinkwrap(testFoo)
      .then(function() {
        return pfs.readFile(
          path.join(testFoo, 'welder-shrinkwrap.json'),
          'utf8'
        );
      })
      .then(JSON.parse)
      .then(function(shrinkwrap) {
        // Travis-CI node 0.10.35 has npm 1 which gives a different from value
        // then Travis-CI node 0.11.13 and npm 2.
        config.shrinkwrap.expect.nodeDependencies.lodash.from =
          shrinkwrap.nodeDependencies.lodash.from;

        expect(shrinkwrap).to.deep.equal(config.shrinkwrap.expect);
      });
  });

});
