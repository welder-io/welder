// TODO use node-git instead of the git cli

const util = require('util');
const exec = require('./exec');

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

exports.fetch = function(opts) {
  var repoPath = opts.path;
  var remote = opts.remote || 'origin';
  var commitIsh = opts.expectedCommitIsh;
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
