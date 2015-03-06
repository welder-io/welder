const path = require('path');

const _ = require('lodash');

const deps = require('./deps');
const exec = require('./exec');
const pfs = require('./pfs');
const promise = require('./promise');

exports.shrinkwrapDeps = _.memoize(function(opts, repo) {
  var dependencyKey = opts.dependencyKey;
  var moduleDir = opts.moduleDir;
  var log = opts.log;

  var repoPath = repo.welder.repoPath;
  var shrinkwrapPath = path.join(repoPath, 'npm-shrinkwrap.json');
  var repoDeps = repo[dependencyKey];
  // Compare names in welder dependencies against npm dependencies. If the
  // dependency only exist in welder deps that unlink it so npm shrinkwrap
  // won't error when it encounters the extraneous dependency.
  var repoNpmDeps = repo.dependencies;
  return promise.resolve(_.pairs(repoDeps))
    .map(function(pair) {
      var depName = pair[0];
      if (!repoNpmDeps || !repoNpmDeps[depName]) {
        return pfs.unlink(path.join(repoPath, moduleDir, depName));
      }
    })
    .then(exec.bind(null, 'npm shrinkwrap', { cwd: repoPath }))
    .then(function(result) {
      log('debug', 'Shrinkwrapping node dependencies ' + repo.name + '...');
      if (result.code === 0) {
        return pfs.readFile(shrinkwrapPath, 'utf8')
          .then(function(shrinkwrap) {
            result.shrinkwrap = JSON.parse(shrinkwrap);
            return result;
          })
          .finally(function() {
            return pfs.unlink(shrinkwrapPath);
          });
      }
      return result;
    });
}, function(opts, repo) { return deps.repoId(repo); });

exports.attachDeps = function(opts, graph) {
  var log = opts.log;

  var nodes = graph.nodes.slice();
  nodes.unshift(graph);

  return promise.resolve(nodes)
    .parallel(function(repo) {
      return exports.shrinkwrapDeps(opts, repo)
        .tap(function(result) {
          if (result.code === 0) {
            repo.nodeDependencies = result.shrinkwrap.dependencies;
          }
        });
    })
    .then(_.partialRight(exec.warnIfAnyExitedNonZero, log))
    .return(graph);
};
