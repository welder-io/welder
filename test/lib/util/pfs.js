const expect = require('chai').expect;

const pfs = require('../../../lib/util/pfs');

describe('pfs', function() {

  describe('::stat', function() {

    it('should resolve a stat object', function() {
      return pfs.stat(__dirname + '/pfs.js')
        .then(function(stat) {
          expect(stat).to.exist;
        });
    });

  });

  describe('::exists', function() {

    it('should resolve true if the file exists', function() {
      return pfs.exists(__dirname + '/pfs.js')
        .then(function(truthy) {
          expect(truthy).to.be.true;
        });
    });

    it('should resolve false if the file does not exist', function() {
      return pfs.exists(__dirname + '/does-not-exist.js')
        .then(function(truthy) {
          expect(truthy).to.be.false;
        });
    });

  });

});
