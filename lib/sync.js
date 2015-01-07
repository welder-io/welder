const path = require('path');

const _ = require('lodash');

const deps = require('./util/deps');
const git = require('./util/git');
const exec = require('./util/exec');
const promise = require('./util/promise');
const resolve = require('./util/resolve');

module.exports = function(dir) {
  var log = this.emit.bind(this);
  var resolvedRepos;
  var processedGraph;
  var self = this;

  return promise.all([this.graph(dir), this.loadRegistry()])
    .bind(this)
    .tap(function(values) {resolvedRepos = values[1];})
    .get(0)
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
      var repoPath = repo.gitfuse.repoPath;
      var remote = resolve.remote(
        repo.registryEntry,
        this.resolveRemoteOptions
      );
      var expectedSha = repo.gitfuse.remoteSha;
      // Fetch the version. Fetching shas is unreliable.
      var expectedVersion = repo.gitfuse.expectedVersion;
      return git.fetch(repoPath, remote, expectedVersion)
        // Having fetched the version we can now checkout the sha. We can't
        // checkout the version as easily as the sha.
        .then(git.checkout.bind(git, repoPath, expectedSha))
        .return(repo);
    })
    .then(function() {return processedGraph.uniqDeps;})
    .parallel(function(repo) {
      log('debug',
        'running ' + self.installCommand + ' for ' + repo.label + '...');
      return exec(self.installCommand, {
        cwd: path.join(dir, '..', repo.label),
        log: log,
      });
    }.bind(this))
    .then(function(results) {
      return exec(this.installCommand, { cwd: dir, log: log, })
        .then(function(result) {
          results.push(result);
          return results;
        });
    })
    .tap(this.status.bind(this, dir))
    .then(_.partialRight(exec.throwIfAnyExitedNonZero, log));
};
