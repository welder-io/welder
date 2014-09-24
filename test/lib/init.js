const fs = require('fs');
const path = require('path');

const rimraf = require('rimraf').sync;
const expect = require('chai').expect;

const config = require('../fixtures/config');
const helpers = require('../helpers');
const Gitfuse = require('../../');

const fuse = new Gitfuse({
  logLevel: 0
});

describe('#init', function() {

  this.timeout(10000);

  before(function() {
    return helpers.setup();
  });

  it('should clone a set of repos into a directory', function() {
    // tested by before hook, just verify output here
    expect(fs.readdirSync(config.repoDir).length).to.equal(4);
  });

  it('should link a repo to dependencies', function() {
    var testFoo = path.resolve(
      config.repoDir, config.registry[0].name, 'node_modules'
    );
    // confirm that init ran link successfully
    expect(fs.readdirSync(testFoo)).to.include('test-bar', 'test-qux');
  });

  it('should find missing repos and add them to a directory', function() {
    rimraf(path.join(config.repoDir, config.registry[0].name));
    return fuse.init(config.repoDir, {repos: config.registry})
      .then(function() {
        expect(fs.readdirSync(config.repoDir).length).to.equal(4);
      });
  });

});
