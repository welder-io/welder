const fs = require('fs');
const path = require('path');

const _ = require('lodash');
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

describe('#version', function() {

  this.timeout(60000);

  beforeEach(function() {
    return helpers.setup()
      .then(function() { return git.fetch(testFoo, 'origin', '0.2.0'); })
      .then(function() { return git.checkout(testFoo, '0.2.0'); });
  });

  it('bumps to specified version of package', function() {
    var packagePath = path.resolve(testFoo, 'package.json');
    return fuse.version({dir: testFoo, version: '0.8.0'})
      .then(function() { return pfs.readFile(packagePath, 'utf8'); })
      .then(JSON.parse)
      .then(function(packageJson) {
        expect(packageJson.version).to.equal('0.8.0');
      });
  });

  it('bumps version category of package', function() {
    var packagePath = path.resolve(testFoo, 'package.json');
    return fuse.version({dir: testFoo, version: 'major'})
      .then(function() { return pfs.readFile(packagePath, 'utf8'); })
      .then(JSON.parse)
      .then(function(packageJson) {
        expect(packageJson.version).to.equal('1.0.0');
      });
  });

  it('bumps shrinkwrap and package file', function() {
    var packagePath = path.resolve(testFoo, 'package.json');
    var shrinkwrapPath = path.resolve(testFoo, 'welder-shrinkwrap.json');
    return pfs
      .writeFile(
        shrinkwrapPath,
        JSON.stringify(config.sync.fromShrinkwrap),
        'utf8'
      )
      .then(function() {
        return fuse.version({dir: testFoo, version: '0.8.0'});
      })
      .then(function() { return [packagePath, shrinkwrapPath]; })
      .map(function(p) { return pfs.readFile(p, 'utf8'); })
      .map(function(j) { return JSON.parse(j); })
      .map(function(json) {
        expect(json.version).to.equal('0.8.0');
      });
  });

});
