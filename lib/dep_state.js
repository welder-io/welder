const path = require('path');

const promise = require('./util/promise');
const pfs = require('./util/pfs');
const git = require('./util/git');
const resolve = require('./util/resolve');

module.exports = function(opts) {
  var cwd = opts.cwd;
  var name = opts.name;
  var isRoot = !!opts.isRoot;
  var registryEntry = opts.registryEntry;
  var version = opts.version;
  var repoPath = path.resolve(cwd || '', '..', name);
  var localExists = pfs.exists(repoPath);
  var gitRemote = registryEntry && resolve.remote(registryEntry);
  return promise.props({
    cwd: cwd,
    isRoot: isRoot,
    repoPath: repoPath,
    localExists: localExists,
    isGitRepo: pfs.exists(path.join(repoPath, '.git')),
    localSha: localExists ? git.sha(repoPath) : '??',
    remoteSha: gitRemote && git.remoteSha(cwd, gitRemote, version),
    isClean: localExists ? git.isClean(repoPath) : true
  });
};
