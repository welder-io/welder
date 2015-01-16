const path = require('path');

const _ = require('lodash');

const deps = require('./util/deps');
const exec = require('./util/exec');
const git = require('./util/git');
const pfs = require('./util/pfs');
const promise = require('./util/promise');
const resolve = require('./util/resolve');

module.exports = function(dir) {
  var log = this.emit.bind(this);
  var resolvedRepos;
  var rawGraph;
  var processedGraph;
  var self = this;

  return promise.all([this.graphTarget(dir), this.loadRegistry()])
    .bind(this)
    .tap(function(values) {resolvedRepos = values[1];})
    .get(0)
    .tap(function(value) {rawGraph = value;})
    .then(deps.processGraph)
    .tap(function(graph) {processedGraph = graph;})
    .get('deps')
    .map(function(repo) {return _.where(resolvedRepos, {name: repo.label});})
    .then(_.flatten)
    .then(_.partialRight(_.unique, false, 'name'))
    .then(function(repos) {
      return this.init(path.resolve(dir, '..'), {repos: repos});
    }.bind(this))
    .then(function() {return processedGraph;})
    .then(function(repos) {
      log('ok', 'checking for out of date repos...');
      if (repos.conflicts.length) {
        log('error', 'sync cannot continue.');
        log('error',
          'the following dependencies have conflicting versions:');
        log('error', repos.conflicts.join(', '));
        log('error', 'aborting.');
        process.exit(1);
      }
      if (repos.uncleanWillChange.length) {
        log('error', 'sync cannot continue.');
        log('error',
          'auto-checkout could conflict with uncomitted local changes in:');
        log('error', deps.extractNames(repos.uncleanWillChange).join(', '));
        log('error', 'aborting.');
        process.exit(1);
      }
      if (repos.uncleanWontChange.length) {
        log('write', 'uncommited local changes found:');
        log('write', deps.extractNames(repos.uncleanWontChange).join(', '));
      }
      return repos.willChange;
    })
    .map(function(repo) {
      var repoPath = repo.welder.repoPath;
      var remote = resolve.remote(repo.registryEntry);
      var expectedSha = repo.welder.remoteSha;
      // Fetch the version. Fetching shas is unreliable.
      var expectedVersion = repo.welder.expectedVersion;
      return git.fetch(repoPath, remote, expectedVersion)
        // Having fetched the version we can now checkout the sha. We can't
        // checkout the version as easily as the sha.
        .then(git.checkout.bind(git, repoPath, expectedSha))
        .return(repo);
    })
    .then(function() {return processedGraph.uniqDeps;})
    .parallel(runInstall.bind(this, dir))
    .then(function(results) {
      return runInstall.call(this, dir, rawGraph)
        .then(function(result) {
          results.push(result);
          return results;
        });
    })
    .tap(function() {
      deps.purgeStateMemos();
    })
    .tap(this.status.bind(this, dir))
    .then(_.partialRight(exec.throwIfAnyExitedNonZero, log));
};

var runInstall = function runInstall(dir, repo) {
  var log = this.emit.bind(this);

  var p = promise.resolve().bind(this);

  if (repo.shrinkwrap) {
    log('debug', 'Writing shrinkwrap for ' + repo.label + '...');
    p = p.tap(function() {
      var shrinkwrap = {
        name: repo.shrinkwrap.name,
        dependencies: repo.shrinkwrap.nodeDependencies,
      };
      return pfs.writeFile(
        path.join(dir, '..', repo.label, 'npm-shrinkwrap.json'),
        JSON.stringify(shrinkwrap),
        'utf8'
      );
    });
  }

  p = p.then(function() {
    log('debug',
      'running ' + this.installCommand + ' for ' + repo.label + '...');
    return exec(this.installCommand, {
      cwd: path.join(dir, '..', repo.label),
      log: log,
    });
  });

  if (repo.shrinkwrap) {
    p = p.finally(function() {
      return pfs.unlink(
        path.join(dir, '..', repo.label, 'npm-shrinkwrap.json')
      );
    });
  }

  return p;
};
