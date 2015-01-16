const fs = require('fs');
const path = require('path');

const _ = require('lodash');
const mkdirp = require('mkdirp').sync;

const deps = require('./util/deps');
const git = require('./util/git');
const exec = require('./util/exec');
const link = require('./util/link');
const promise = require('./util/promise');
const resolve = require('./util/resolve');

module.exports = function(dir, opts) {
  opts = opts || {};
  dir = path.resolve(dir);
  var log = this.emit.bind(this);
  var concurrency = this.concurrency;
  var repos = opts.repos || this.loadRegistry();

  var ready = promise.resolve(repos);

  var self = this;
  return ready
    .bind(this)
    .then(function() {
      log('ok', 'initializing your project...');

      log('debug', 'running mkdirp for ' + dir);
      mkdirp(dir);

      log('debug', 'reading ' + dir + ' for existing repos...');
      var inDir = fs.readdirSync(dir);

      // TODO: make smart enough to repair unfinished clones
      log('debug', 'pruning repos that already exist...');
      var missingRepos = promise.resolve(repos).filter(function(repo) {
        var alreadyPresent = inDir.indexOf(repo.name) !== -1;
        if (alreadyPresent) {
          log('debug', repo.name + ' already present, ignoring...');
          return false;
        }
        return true;
      });

      log('debug',
        'cloning with concurrency of ' + concurrency + '...');
      return promise.resolve(missingRepos)
        .bind(this)
        .parallel(function(repo) {
          log('write', 'cloning ' + repo.name + '...');
          return git.clone(resolve.remote(repo), dir)
            .catch(log.bind(null, 'error'))
            .return(repo);
        }, { concurrency: concurrency })
        .tap(function(repos) {
          if (repos.length) {
            log('ok', 'symlinking repos together...');
            link({
              dir: dir,
              dependencyKey: this.dependencyKey,
              moduleDir: this.moduleDir
            });
            log('ok', 'symlinking complete.');
          }
        })
        .tap(function(repos) {
           if (repos.length) {
             log('ok', 'running install command for all new repos...');
           }
         })
         .parallel(function(repo) {
           log('write',
             'running ' + self.installCommand + ' for ' + repo.name + '...');
           return exec(self.installCommand, {
             cwd: path.join(dir, repo.name),
             log: log,
           });
         }, { concurrency: concurrency })
         .tap(function(results) {
           if (results.length) {
            log('ok', 'initialization complete.');
          } else {
            log('ok', 'all repos present.');
          }
        })
        .tap(function() {
          link({
            dir: dir,
            dependencyKey: this.dependencyKey,
            moduleDir: this.moduleDir
          });
        })
        .tap(function(results) {
          if (results.length > 0) {
            deps.purgeStateMemos();
          }
        });
    })
    .then(_.partialRight(exec.throwIfAnyExitedNonZero, log))
    .catch(function(e) {
      log('error', '\nInit cancelled.');
      throw e;
    });

};
