const fs = require('fs');
const path = require('path');

const mkdirp = require('mkdirp').sync;

const git = require('./util/git');
const exec = require('./util/exec');
const link = require('./util/link');
const promise = require('./util/promise');
const resolve = require('./util/resolve');

module.exports = function(opts) {
  if (typeof opts === 'string') {
    opts = {
      dir: opts
    };
  }
  var dir = path.resolve(opts.dir);
  var log = this.emit.bind(this);
  var concurrency = this.concurrency;
  var repos = opts.repos || this.loadRegistry();

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
    .parallel(function(repo) {
      log('write', 'cloning ' + repo.name + '...');
      return git.clone(resolve.remote(repo), dir).return(repo);
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
    }.bind(this))
    .tap(function(repos) {
       if (repos.length) {
         log('ok', 'running install command for all new repos...');
       }
     })
     .parallel(function(repo) {
       log('write',
         'running ' + this.installCommand + ' for ' + repo.name + '...');
       return exec(this.installCommand, {
         cwd: path.join(dir, repo.name)
       });
     }.bind(this), { concurrency: concurrency })
    .tap(function(repos) {
      if (repos.length) {
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
    });
};
