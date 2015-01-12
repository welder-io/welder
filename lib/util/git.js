// TODO use node-git instead of the git cli

const _ = require('lodash');
const semver = require('semver');
const util = require('util');

const exec = require('./exec');
const promise = require('./promise');

exports.branch = function(repoPath) {
  var cmd = exec('git rev-parse --abbrev-ref HEAD', {cwd: repoPath});
  return cmd.then(function(result) {
    if (result.code !== 0) {
      return false;
    }
    return result.output.trim();
  });
};

exports.remote = function(repoPath, remote) {
  if (!remote) {
    remote = 'origin';
  }
  var cmd = exec('git config --get remote.' + remote + '.url', {cwd: repoPath});
  return cmd.then(function(result) {
    return result.output.trim();
  });
};

exports.sha = function(repoPath) {
  var cmd = exec('git rev-parse HEAD', {cwd: repoPath});
  return cmd.then(function(result) {
    if (result.code !== 0) {
      return false;
    }
    return result.output.trim();
  });
};

exports.remoteSha = function(repoPath, remote, commitIsh) {
  var cmd = util.format('git ls-remote %s %s', remote, commitIsh);
  return exec(cmd, {cwd: repoPath}).then(function(result) {
    if (result.code !== 0) {
      return false;
    }
    var sha = result.output.trim().split('\t')[0];
    if (sha.length === 0) {
      return false;
    }
    return sha;
  });
};

exports.remoteRef = function(repoPath, remote, sha) {
  var cmd = util.format('git ls-remote -t -h %s', remote);
  var refs = exec(cmd, {cwd: repoPath});
  return promise.all([refs, sha])
    .spread(function(result, sha) {
      if (result.code !== 0) {
        return false;
      }
      var lines = result.output.trim().split('\n').filter(function(record) {
        return record.indexOf(sha) === 0;
      });
      var tags = lines.filter(function(record) {
        return record.indexOf('refs/tags/') !== -1;
      });
      var result;
      if (tags.length > 0) {
        result = /^.+\/(.+?)$/.exec(tags[0])[1];
      } else if (lines.length > 0) {
        result = /^.+\/(.+?)$/.exec(lines[0])[1];
      } else {
        result = false;
      }
      return result;
    });
};

exports.fetch = function(repoPath, remote, commitIsh) {
  if (!remote) {
    remote = 'origin';
  }
  var cmd = util.format('git fetch %s %s', remote, commitIsh);
  return exec(cmd, {cwd: repoPath});
};

exports.checkout = function(repoPath, commitIsh) {
  var cmd = util.format('git checkout %s', commitIsh);
  return exec(cmd, {cwd: repoPath});
};

exports.clone = function(repoUrl, repoPath) {
  return exec('git clone ' + repoUrl, {cwd: repoPath}).then(function(result) {
    if (!!result.code) {
      throw new Error('Git failed to clone ' + repoUrl + '. to ' + repoPath);
    }
  }).return();
};

exports.isClean = function(repoPath) {
  return exec('git status -s', {cwd: repoPath}).then(function(result) {
    return result.code === 0 && result.output === '';
  });
};

exports.remoteVersions = function(remote) {
  var cmd = util.format('git ls-remote -t -h %s', remote);
  return exec(cmd).then(function(result) {
    if (result.code !== 0) {
      return false;
    }
    return result.output.split('\n').map(function(entry) {
      return entry.split('/').pop();
    }).slice(0, -1);
  });
};

exports.remoteMaxSatisfyingVersion = function(remote, version) {
  var result = promise.resolve(version);
  // Only check remove versions for a match if version is semver. If semver is
  // master or anything that doesn't parse as semver it'll be returned directly.
  if (semver.validRange(version)) {
    result = exports.remoteVersions(remote)
      .filter(semver.valid)
      .then(_.partialRight(semver.maxSatisfying, version))
      .then(function(satisfied) {
        if (!satisfied) {
          throw new Error(
            'No semantic version match to ' + version + ' for ' + remote
          );
        }
        return satisfied;
      });
  }
  return result;
};
