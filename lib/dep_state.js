const path = require('path');

const promise = require('./util/promise');
const pfs = require('./util/pfs');
const git = require('./util/git');
const resolve = require('./util/resolve');

module.exports = function(parent, dep) {
  var cwd = parent.gitfuse && parent.gitfuse.cwd;
  var dependencies = parent && parent[this.dependencyKey];
  var repoPath = path.resolve(cwd || '', '..', dep.name);
  var localExists = pfs.exists(repoPath);
  var version = dependencies && dependencies[dep.name];
  var gitRemote = dep && resolve.remote(dep.registryEntry);
  return promise.props({
    cwd: cwd,
    isRoot: !!parent.isRoot,
    repoPath: repoPath,
    localExists: localExists,
    isGitRepo: pfs.exists(path.join(repoPath, '.git')),
    localSha: localExists ? git.sha(repoPath) : '??',
    remoteSha: gitRemote && git.remoteSha(cwd, gitRemote, version),
    isClean: localExists ? git.isClean(repoPath) : true
  });
};
