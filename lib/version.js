const path = require('path');

const _ = require('lodash');
const semver = require('semver');

const deps = require('./util/deps');
const git = require('./util/git');
const pfs = require('./util/pfs');
const promise = require('./util/promise');

module.exports = function(opts) {
  var dir = opts.dir;
  var versionBump = opts.version;

  var absConfigFile = path.join(dir, this.configurationFile);
  var bumped;

  return pfs.readFile(absConfigFile, 'utf8')
    .bind(this)
    .then(JSON.parse)
    .then(function(packageJson) {
      var version = packageJson.version || '0.0.0';

      if (semver.valid(versionBump)) {
        bumped = versionBump;
      } else {
        bumped = semver.inc(version, versionBump);
      }

      this.emit('ok', 'Bumping ' + packageJson.name + ' to ' + bumped + ' ...');

      return [this.configurationFile, 'welder-shrinkwrap.json'];
    })
    .map(function(fileName) {
      return promise.props({
        fileName: fileName,
        exists: pfs.exists(path.join(dir, fileName)),
      });
    })
    .filter(function(fileObj) {
      return fileObj.exists;
    })
    .parallel(function(fileObj) {
      return bumpFile.call(this, dir, fileObj.fileName, bumped)
        .return(fileObj);
    }, {concurrency: 1})
    .map(function(fileObj) {
      return fileObj.fileName;
    })
    .then(function(files) {
      return git.commit(dir, files, bumped);
    })
    .tap(function() { this.emit('ok', 'Committed ' + bumped + '.'); })
    .then(function() {
      return git.tag(dir, bumped, bumped);
    })
    .tap(function() { this.emit('ok', 'Tagged ' + bumped + '.'); });
};

var bumpFile = function bumpFile(dir, fileName, bumped) {
  var log = this.emit.bind(this);
  var absFile = path.join(dir, fileName);

  return pfs.readFile(absFile, 'utf8')
    .bind(this)
    .then(JSON.parse)
    .then(function(json) {
      log('ok', 'Bumping ' + json.name + ' to ' + bumped + ' ...');

      var outObj = {
        name: json.name,
        version: bumped,
      };
      _.each(json, function(v, k) {
        if (!outObj.hasOwnProperty(k)) {
          outObj[k] = v;
        }
      });

      return outObj;
    })
    .then(_.partialRight(JSON.stringify, false, '  '))
    .then(_.partialRight(pfs.writeFile.bind(pfs, absFile), 'utf8'))
    .then(function() { log('ok', 'Updated ' + fileName + '.'); });
};
