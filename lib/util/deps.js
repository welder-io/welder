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
    if (this.notRoot && this.notLeaf && !isNaN(parseInt(this.key))) {
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
      var sameVersion = (dep.gitfuse.remoteSha === checkDep.gitfuse.remoteSha);
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
      var gitfuse = this.node.gitfuse;
      var label, expectedSha, actualSha;
      label = [this.node.label];
      if (gitfuse && gitfuse.isGitRepo) {
        label.push(gitfuse.expectedVersion||null)
        expectedSha = (gitfuse.remoteSha || '??').substring(0, 8);
        actualSha = (gitfuse.localSha || '??').substring(0, 8);
        label.push(actualSha);
        // make sha green for root node, and nodes that are correct
        if (gitfuse.isRoot || actualSha === expectedSha) {
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
  return !dep.gitfuse.isClean;
};

var atWrongCommit = function(dep) {
  return dep.gitfuse.isGitRepo &&
    dep.gitfuse.localSha !== dep.gitfuse.remoteSha;
};

var atRightCommit = function(dep) {
  return dep.gitfuse.localSha === dep.gitfuse.remoteSha;
};

var repoId = function(opts) {
  return opts.name + ':' + opts.version;
};

var uniqRepos = _.partialRight(_.uniq, repoId);

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

exports.state = _.memoize(function(opts) {
  var cwd = opts.cwd;
  var name = opts.name;
  var isRoot = !!opts.isRoot;
  var registryEntry = opts.registryEntry;
  var version = opts.version||null;
  var repoPath = path.resolve(cwd || '', '..', name);
  var localExists = pfs.exists(repoPath);
  var gitRemote = registryEntry && resolve.remote(registryEntry);
  return promise.props({
    cwd: cwd,
    isRoot: isRoot,
    repoPath: repoPath,
    localExists: localExists,
    isGitRepo: pfs.exists(path.join(repoPath, '.git')),
    expectedVersion: git.remoteMaxSatisfyingVersion(gitRemote, version),
    localSha: localExists ? git.sha(repoPath) : '??',
    remoteSha: gitRemote && git.remoteSha(cwd, gitRemote, version),
    isClean: localExists ? git.isClean(repoPath) : true
  });
}, repoId);

exports.extractNames = function(deps) {
  return deps.map(function(dep) {
    return dep.label;
  });
};
