const path = require('path');

const _ = require('lodash');
const traverse = require('traverse');

const deps = require('./util/deps');
const exec = require('./util/exec');
const link = require('./util/link');
const npm = require('./util/npm');
const pfs = require('./util/pfs');
const promise = require('./util/promise');

module.exports = function(dir) {
  var dependencyKey = this.dependencyKey;
  var moduleDir = this.moduleDir;
  var log = this.emit.bind(this);

  return this.graphActive(dir)
    .bind(this)
    // Flatten the graph for use in shrinkwrapping.
    .then(function(graph) {
      var root = _.clone(graph);
      root.nodes = deps.uniqRepos(deps.flattenGraph(graph));
      root.nodes = root.nodes.map(function(node) {
        node = _.clone(node);
        delete node.nodes;
        return node;
      });
      return root;
    })
    // Attach npm dependencies on .nodeDependcies.
    .then(npm.attachDeps.bind(null, {
      dependencyKey: dependencyKey,
      moduleDir: moduleDir,
      log: log,
    }))
    .then(toShrinkwrapNodes)
    .then(function(graph) {
      return JSON.stringify(graph, false, '  ').split('\n');
    })
    .then(function(lines) {
      return pfs.writeFile(
        path.join(dir, 'welder-shrinkwrap.json'), lines.join('\n'), 'utf8'
      );
    })
    .then(function() {
      log('ok', 'Wrote welder-shrinkwrap.json.');
    })
    .tap(function() {
      link({
        dir: dir,
        dependencyKey: this.dependencyKey,
        moduleDir: this.moduleDir
      });
    });
};

function toShrinkwrapNodes(graph) {
  var dependencyKey = this.dependencyKey;
  return traverse(graph).map(function(node) {
    if (!this.notRoot || this.notLeaf && !isNaN(parseInt(this.key))) {
      var o = {
        name: node.name,
        version: node.welder.localVersion,
        sha: node.welder.localSha,
        nodeDependencies: node.nodeDependencies,
      };
      o[dependencyKey] = node.nodes;
      return o;
    }
    return node;
  });
  return graph;
}
