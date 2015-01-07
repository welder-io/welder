const expect = require('chai').expect;
const exec = require('../../../lib/util/exec');
const fs = require('fs');

describe('exec', function() {

  it('should resolve to the stdout/code of a command', function() {
    return exec('cat README.md').then(function(result) {
      expect(result.code).to.equal(0);
      expect(result.output).to.equal(fs.readFileSync('./README.md', 'utf8'));
    });
  });

  describe('#throwIfAnyExitedNonZero', function() {

    it('should return results if all exited with code 0', function() {
      var results = [{ code: 0 }];
      expect(exec.throwIfAnyExitedNonZero(results)).to.equal(results);
    });

    it('should throw if any exited non zero', function() {
      var results = [{
        code: 1,
        command: 'FAKE',
        opts: {},
      }];
      var log = function() {};
      expect(exec.throwIfAnyExitedNonZero.bind(null, results, log))
        .to.throw(Error);
    });

  });

  // more tests needed

});
