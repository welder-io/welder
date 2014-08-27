const expect = require('chai').expect;
const exec = require('../../../lib/util/exec');
const fs = require('fs');

describe('exec', function() {

  it('should resolve to the stdout/code of a command', function() {
    return exec('cat README.md').then(function(result) {
      expect(result).to.deep.equal({
        code: 0,
        err: null,
        output: fs.readFileSync('./README.md', 'utf8')
      });
    });
  });

  // more tests needed

});
