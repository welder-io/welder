const expect = require('chai').expect;

const Gitfuse = require('../../');
const registry = require('../fixtures/config').registry;
const fuse = new Gitfuse({ registry: registry });

describe('#find', function() {

  it('should find a package in the registry by name', function() {
    return fuse.find(registry[0].name).then(function(result) {
      expect(result).to.equal(registry[0]);
    });
  });

});
