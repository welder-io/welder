const path = require('path');

const _ = require('lodash');
const archy = require('archy');
const chalk = require('chalk');
const traverse = require('traverse');

const pfs = require('./pfs');
const git = require('./git');
const resolve = require('./resolve');
const promise = require('./promise');

var flattenGraph = exports.flattenGraph = function(graph) {
  return traverse(graph).reduce(function(acc, node) {
    if (
      this.notRoot &&
      this.notLeaf &&
      !isNaN(parseInt(this.key)) &&
      node.welder
    ) {
      acc.push(node);
    }
    return acc;
  }, []);
};

var findConflicts = exports.findConflicts = function(graph) {
  var deps = flattenGraph(graph);
  return deps.reduce(function(acc, dep) {
    var conflicts = deps.filter(function(checkDep) {
      var sameDep = (dep.label === checkDep.label);
      var sameVersion = (dep.welder.remoteSha === checkDep.welder.remoteSha);
      return (sameDep && !sameVersion);
    });

    if (conflicts.length && acc.indexOf(dep.label) === -1) {
      acc.push(dep.label);
    }
    return acc;
  }, []);
};

exports.visualize = function(graph) {
  return archy(traverse(_.cloneDeep(graph)).forEach(function() {
    if (this.notLeaf) {
      var welder = this.node.welder;
      var label, expectedSha, actualSha;
      label = [this.node.label];
      if (welder && welder.isGitRepo) {
        label.push(welder.expectedVersion||null)
        expectedSha = (welder.remoteSha || '??').substring(0, 8);
        actualSha = (welder.localSha || '??').substring(0, 8);
        label.push(actualSha);
        // make sha green for root node, and nodes that are correct
        if (welder.isRoot || actualSha === expectedSha) {
          label[2] = chalk.green(label[2]);
        } else {
          label[2] = chalk.red(label[2]);
          label.push('expected ' + chalk.green(expectedSha) + '');
        }
      } else {
        label.push(chalk.red('missing!'));
      }

      this.node.label = label.join(' / ');
    }
  })).split('\n').slice(0, -1);
};

var isUnclean = function(dep) {
  return !dep.welder.isClean;
};

var atWrongCommit = function(dep) {
  return dep.welder.isGitRepo &&
    dep.welder.localSha !== dep.welder.remoteSha;
};

var atRightCommit = function(dep) {
  return dep.welder.localSha === dep.welder.remoteSha;
};

var repoId = exports.repoId = function(opts) {
  return opts.name + ':' + opts.version;
};

var uniqRepos = exports.uniqRepos = _.partialRight(_.uniq, repoId);

exports.processGraph = function(graph) {
  var depList = flattenGraph(graph);
  var unclean = depList.filter(isUnclean);
  var uncleanUniq = uniqRepos(unclean);
  return {
    conflicts: findConflicts(depList),
    unclean: unclean,
    uncleanWillChange: uncleanUniq.filter(atWrongCommit),
    uncleanWontChange: uncleanUniq.filter(atRightCommit),
    willChange: uniqRepos(depList).filter(atWrongCommit),
    deps: depList,
    uniqDeps: uniqRepos(depList),
  };
};

// TODO: Split state into two calls and objects. One for local operations and
// one for remote operations. That likely would remove the need to purge the
// cached values so that local values can be reset.
exports._state = function(opts) {
  var cwd = opts.cwd;
  var name = opts.name;
  var isRoot = !!opts.isRoot;
  var registryEntry = opts.registryEntry;
  var version = opts.version||null;
  var repoPath = path.resolve(cwd || '', '..', name);
  var localExists = pfs.exists(repoPath);
  var gitRemote = registryEntry && resolve.remote(registryEntry);
  var expectedVersion = git.remoteMaxSatisfyingVersion(gitRemote, version);
  return promise.props({
    cwd: cwd,
    isRoot: isRoot,
    repoPath: repoPath,
    localExists: localExists,
    isGitRepo: pfs.exists(path.join(repoPath, '.git')),
    localVersion: git.remoteRef(repoPath, gitRemote, git.sha(repoPath)),
    expectedVersion: expectedVersion,
    localSha: localExists ? git.sha(repoPath) : '??',
    remoteSha: gitRemote && git.remoteSha(cwd, gitRemote, expectedVersion),
    isClean: localExists ? git.isClean(repoPath) : true
  });
};

exports.state = _.memoize(exports._state, repoId);

exports.purgeStateMemos = function() {
  exports.state = _.memoize(exports._state, repoId);
};

exports.extractNames = function(deps) {
  return deps.map(function(dep) {
    return dep.label;
  });
};
