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

  it('should find missing repos and add them to a directory', function() {
    rimraf(path.join(config.repoDir, config.registry[0].name));
    return fuse.init({
      repos: config.registry,
      dir: config.repoDir,
    }).then(function() {
      expect(fs.readdirSync(config.repoDir).length).to.equal(4);
    });
  });

});
