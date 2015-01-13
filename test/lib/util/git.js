const fs = require('fs');
const path = require('path');

const expect = require('chai').expect;

const git = require('../../../lib/util/git');
const pfs = require('../../../lib/util/pfs');
const resolve = require('../../../lib/util/resolve');

const helpers = require('../../helpers');
const config = require('../../fixtures/config');

const testBar = path.resolve(config.repoDir, config.registry[1].name);

describe('git', function() {

  this.timeout(20000);

  before(function() {
    return helpers.setup();
  });

  describe('#clone', function() {

    it('should clone a repo into a specified path', function() {
      // tested by before hook, just verify output here
      expect(fs.existsSync(testBar)).to.be.true;
    });

    it('should throw an error if clone fails', function(done) {
      git.clone('git@github.com:fake/fake.git').catch(function() {
        done();
      });
    });

  });

  describe('#commit', function() {

    after(function() {
      return helpers.setup();
    });

    it('should not throw', function() {
      var fileName = 'new-file.txt';
      var filePath = path.join(testBar, fileName)
      return pfs.writeFile(filePath, 'content', 'utf8')
        .then(function() {
          return git.commit(testBar, [fileName], 'Add new file');
        });
    });

  });

  describe('#tag', function() {

    after(function() {
      return helpers.setup();
    });

    it('should tag a version', function() {
      return git.tag(testBar, '1.0.0', '1.0.0');
    });

  });

  describe('#branch', function() {

    it('should eventually return the branch of a given repo', function() {
      return git.branch(testBar).then(function(result) {
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
      return git.sha(testBar).then(function(result) {
        expect(result).to.equal('47e1d99cba8ccb24624c571bbf420b2c09a3e326');
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
      return git.remote(testBar).then(function(remote) {
        return git.remoteSha(testBar, 'origin', 'master')
          .then(function(result) {
            expect(result).to.equal('47e1d99cba8ccb24624c571bbf420b2c09a3e326');
          })
          .return(git.remoteSha(testBar, remote, 'master'))
          .then(function(result) {
            expect(result).to.equal('47e1d99cba8ccb24624c571bbf420b2c09a3e326');
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

  describe("#remoteRef", function() {

    it('should resolve the ref for a sha on the remote', function() {
      return git.remote(testBar).then(function(remote) {
        return git
          .remoteRef(
            testBar, 'origin', '47e1d99cba8ccb24624c571bbf420b2c09a3e326'
          )
          .then(function(result) {
            expect(result).to.equal('v0.2.0');
          })
          .return(git.remoteRef(
            testBar, remote, '47e1d99cba8ccb24624c571bbf420b2c09a3e326'
          ))
          .then(function(result) {
            expect(result).to.equal('v0.2.0');
          });
      });
    });

  });

  describe('#isClean', function() {

    it('should eventually be true if repo is clean', function() {
      return git.isClean(testBar).then(function(result) {
        expect(result).to.be.true;
      });
    });

    it('should eventually be false if repo is not clean', function() {
      fs.writeFileSync(path.join(testBar, 'tmp'), 'tmp', 'utf-8');
      return git.isClean(testBar).then(function(result) {
        expect(result).to.be.false;
      });
    });

  });

  describe('#remoteVersions', function() {

    it('should return an array of tag and head names for a remote', function() {
      return git.remoteVersions(resolve.remote(config.registry[1]))
        .then(function(result) {
          expect(result)
            .to.deep.equal(['master', '0.1.0', '0.1.1', 'v0.2.0']);
        });
    });
  });

  describe('#remoteMaxSatisfyingVersion', function() {

    it('should return the max version for a semver range', function() {
      var remote = resolve.remote(config.registry[1]);
      return git.remoteMaxSatisfyingVersion(remote, '0.1')
        .then(function(result) {
          expect(result).to.equal('0.1.1');
        });
    });

    it('should return version if it isn\'t a semver range', function() {
      var remote = resolve.remote(config.registry[1]);
      return git.remoteMaxSatisfyingVersion(remote, 'master')
        .then(function(result) {
          expect(result).to.equal('master');
        });
    });

    it('should error if no version matches', function() {
      var remote = resolve.remote(config.registry[1]);
      return git.remoteMaxSatisfyingVersion(remote, '1.0')
        .catch(function(e) {
          expect(e).to.be.an.instanceof(Error);
        });
    });

  });

/*
  describe('#fetch', function() {

    it('should fetch a specified commit-ish from a provide remote', function() {

    });

  });
*/
  describe('#checkout', function() {

    it('should check out a provided commit-ish', function() {
      var commitIsh = '623d3eeccd4862153dbe1b36258b7aa8f8dcc8e8';
      return git.checkout(testBar, commitIsh).then(function() {
        return git.sha(testBar).then(function(sha) {
          expect(sha).to.equal(commitIsh);
        });
      });
    });

  });

});
