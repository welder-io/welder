const expect = require('chai').expect;

const pkg = require('../../../lib/util/pkg');

describe('pkg', function() {

  describe('::loadFrom', function() {

    it('should return package.json from specified directory', function() {
      expect(pkg.loadFrom('./'))
        .to.deep.equal(require('../../../package.json'));
    });

  });

});
