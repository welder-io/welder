const fs = require('fs');
const path = require('path');

const expect = require('chai').expect;

const git = require('../../../lib/util/git');
const resolve = require('../../../lib/util/resolve');

const helpers = require('../../helpers');
const config = require('../../fixtures/config');

const testRepoOne = path.resolve(config.repoDir, config.registry[0].name);

describe('git', function() {

  this.timeout(20000);

  before(function() {
    helpers.clearRepos();
    return git.clone(resolve.remote(config.registry[0]), config.repoDir);
  });

  describe('#clone', function() {

    it('should clone a repo into a specified path', function() {
      // tested by before hook, just verify output here
      expect(fs.existsSync(testRepoOne)).to.be.true;
    });

    it('should throw an error if clone fails', function(done) {
      git.clone('git@github.com:fake/fake.git').catch(function() {
        done();
      });
    });

  });

  describe('#branch', function() {

    it('should eventually return the branch of a given repo', function() {
      return git.branch(testRepoOne).then(function(result) {
        expect(result).to.equal('master');
      });
    });

    it('should eventually return false if no branch was found', function() {
      return git.branch('/usr').then(function(result) {
        expect(result).to.be.false;
      });
    });

  });

  describe('#sha', function() {

    it('should return the current commit of a given repo', function() {
      return git.sha(testRepoOne).then(function(result) {
        expect(result).to.equal('1cc2684d0f250aedfa7398e03cd8fa785ec97e4d');
      });
    });

    it('should eventually return false if no git repo was found', function() {
      return git.sha('/').then(function(result) {
        expect(result).to.be.false;
      });
    });

  });

  describe('#remoteSha', function() {

    it('should resolve the current sha on the remote origin', function() {
      return git.remote(testRepoOne).then(function(remote) {
        return git.remoteSha(testRepoOne, 'origin', 'master')
          .then(function(result) {
            expect(result).to.equal('1cc2684d0f250aedfa7398e03cd8fa785ec97e4d');
          })
          .return(git.remoteSha(testRepoOne, remote, 'master'))
          .then(function(result) {
            expect(result).to.equal('1cc2684d0f250aedfa7398e03cd8fa785ec97e4d');
          });
      });
    });

    it('should resolve false if no git repo was found', function() {
      return git.remoteSha('/usr')
        .then(function(result) {
          expect(result).to.be.false;
        });
    });

  });

  describe('#isClean', function() {

    it('should eventually be true if repo is clean', function() {
      return git.isClean(testRepoOne).then(function(result) {
        expect(result).to.be.true;
      });
    });

    it('should eventually be false if repo is not clean', function() {
      fs.writeFileSync(path.join(testRepoOne, 'tmp'), 'tmp', 'utf-8');
      return git.isClean(testRepoOne).then(function(result) {
        expect(result).to.be.false;
      });
    });

  });

  describe('#fetch', function() {

    it('should fetch a specified commit-ish from a provide remote', function() {

    });

  });
/*
  describe('#checkout', function() {

    it('should check out a provided commit-ish', function() {
      var commitIsh = '1cc2684d0f250aedfa7398e03cd8fa785ec97e4d';
      return git.checkout(
        testRepoOne,
        commitIsh
      ).then(function() {
        return git.sha(testRepoOne).then(function(sha) {
          expect(sha).to.equal(commitIsh);
        });
      });
    });

  });
*/
});
