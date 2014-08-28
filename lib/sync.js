const path = require('path');

const _ = require('lodash');

const deps = require('./util/deps');
const git = require('./util/git');
const npm = require('./util/npm');
const promise = require('./util/promise');

module.exports = function(cwd) {
  var log = this.emit.bind(this);
  var resolvedRepos;
  var processedGraph;

  return promise.all([this.graph(cwd), this.loadRegistry()])
    .tap(function(values) {resolvedRepos = values[1];})
    .get(0)
    .then(deps.processGraph)
    .tap(function(graph) {processedGraph = graph;})
    .get('deps')
    .map(function(repo) {return _.where(resolvedRepos, {name: repo.label});})
    .then(_.flatten)
    .then(_.partialRight(_.unique, false, 'name'))
    .then(function(repos) {
      return this.init({
        cwd: path.resolve(cwd, '..'),
        repos: repos
      });
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
      return git.fetch(repo)
        .then(
          git.checkout.bind(git, repo.gitfuse.repoPath, repo.gitfuse.remoteSha)
        )
        .return(repo);
    })
    .then(function() {return processedGraph.deps;})
    .parallel(function(repo) {
      log('debug', 'npm installing ' + repo.label + '...');
      return npm.execInstall(path.join(cwd, '..', repo.label));
    })
    .then(npm.execInstall.bind(npm, cwd))
    .then(this.status.bind(this, cwd));
};
