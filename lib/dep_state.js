const path = require('path');

const promise = require('./util/promise');
const pfs = require('./util/pfs');
const git = require('./util/git');
const resolve = require('./util/resolve');

module.exports = function (parent, dep) {
  var cwd = parent.cwd || (parent.gitfuse && parent.gitfuse.cwd);
  // if an explicit cwd was provided, this is the root repo
  var isRoot = !!parent.cwd;
  var dependencies = parent[this.dependencyKey];
  var repoPath = path.resolve(cwd || '', '..', dep.name);
  var localExists = pfs.exists(repoPath);
  var version = dependencies && dependencies[dep.name];
  var depFromRegistry = this.find(dep.name);
  return promise.props({
    cwd: cwd,
    isRoot: isRoot,
    repoPath: repoPath,
    localExists: localExists,
    isGitRepo: pfs.exists(path.join(repoPath, '.git')),
    localSha: localExists ? git.sha(repoPath) : '??',
    remoteSha: git.remoteSha(cwd, resolve.remote(depFromRegistry), version),
    isClean: localExists ? git.isClean(repoPath) : true
  }).then(function (gitfuse) {
    dep.gitfuse = gitfuse;
    return dep;
  });
};
