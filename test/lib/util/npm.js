const fs = require('fs');
const path = require('path');

const expect = require('chai').expect;

const npm = require('../../../lib/util/npm');
const helpers = require('../../helpers');

const config = require('../../fixtures/config');

const testRepoOne = path.resolve(config.repoDir, config.registry[0].name);

describe('npm', function() {

  describe('::execInstall', function() {
    this.timeout(10000);

    before(function() {
      return helpers.setup();
    });

    it('should run npm install on a project', function() {
      return npm.execInstall(testRepoOne).then(function() {
        var pkg = require(path.join(testRepoOne, 'package'));
        Object.keys(pkg.dependencies).forEach(function(dep) {
          expect(fs.existsSync(path.join(testRepoOne, 'node_modules', dep)))
            .to.be.true;
        });
      });
    });

  });

  describe('::which', function() {

    it('should resolve if the node binary is in PATH', function() {
      return npm.which('node');
    });

    it('should reject if the node binary is not in PATH', function(done) {
      npm.which('testbinarynotinpath').then(function() {
        done(new Error('Should not be here.'));
      }).catch(function() {
        done();
      });
    });

  });

});
