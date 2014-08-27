const expect = require('chai').expect;

const Gitfuse = require('../../');
const registry = require('../fixtures/config').registry;
const fuse = new Gitfuse({ registry: registry });

describe('#find', function() {

  it('should find a package in the registry by name', function() {
    expect(fuse.find(registry[0].name)).to.equal(registry[0]);
  });

});
