const expect = require('chai').expect;
const github = require('../../../lib/util/github');
const config = require('../../fixtures/config');

describe('github', function() {

  this.timeout(20000);

  describe('::requestFile', function() {

    it('should request a file from a github repostiory', function() {
      return github.requestFile(config.registry[0], 'package.json').
        then(function(file) {
          expect(JSON.parse(file)).to.deep.equal({
            name: 'test-foo',
            description: 'test repo for gitfuse',
            version: '0.1.0',
            private: true,
            dependencies: {
              lodash: '~2.4.1'
            },
            gitfuseDependencies: {
              'test-bar': 'master',
              'test-qux': 'branch'
            }
          });
        });
    });

  });

});
