const _ = require('lodash');
const expect = require('chai').expect;

const concurrency = 4;

const promise = require('../../../lib/util/promise');

describe('promise', function() {

  describe('::parallel', function() {

    it('should run tasks concurrently', function() {
      var range = _.range(10);
      var arr = [];
      return promise.resolve(range).parallel(function(val) {
        if (arr.push(val) > concurrency - 1) {
          throw new Error(arr);
        }
        return promise.resolve(val).delay(100).then(function() {
          arr.pop();
        });
      }, { concurrency: concurrency }).then(function() {
        throw new Error('Should not arrive here');
      }, function(e) {
        expect(e).to.be.instanceof(Error);
      });
    });

  });
});
