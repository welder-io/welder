const expect = require('chai').expect;
const resolve = require('../../../lib/util/resolve');

describe('resolve', function() {

  describe('::remote', function() {

    it('should return a git remote for a registry entry', function() {
      expect(resolve.remote({
        name: 'test',
        user: 'test',
        host: 'test.com'
      })).to.equal('git@test.com:test/test.git');
      expect(resolve.remote({
        name: 'test',
        user: 'test',
        host: 'test.com',
        sshUser: 'test'
      })).to.equal('test@test.com:test/test.git');
      expect(resolve.remote({
        name: 'test',
        user: 'test',
        host: 'test.com'
      }, { httpsPublic: true })).to.equal('https://test.com/test/test.git');
      expect(resolve.remote({
        name: 'test',
        user: 'test',
        host: 'test.com',
        sshUser: 'test'
      }, { httpsPublic: true })).to.equal('https://test.com/test/test.git');
    });

  });

  describe('::url', function() {

    it('should return a npm-compatible dependency url', function() {
      expect(resolve.url({
        name: 'test',
        user: 'test',
        host: 'test.com'
      })).to.equal('git://git@test.com:test/test.git');
      expect(resolve.url({
        name: 'test',
        user: 'test',
        host: 'test.com',
        isPrivate: true
      })).to.equal('git+ssh://git@test.com:test/test.git');
      expect(resolve.url({
        name: 'test',
        user: 'test',
        host: 'test.com',
        sshUser: 'test'
      })).to.equal('git://test@test.com:test/test.git');
      expect(resolve.url({
        name: 'test',
        user: 'test',
        host: 'test.com',
        sshUser: 'test',
        isPrivate: true
      })).to.equal('git+ssh://test@test.com:test/test.git');
    });

  });
});
