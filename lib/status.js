const _ = require('lodash');
const traverse = require('traverse');

const deps = require('./util/deps');
const promise = require('./util/promise');

module.exports = function(dir, opts) {
  opts = opts || {};
  if (opts.tags && (!opts.json || !opts.flat)) {
    return promise.reject(new Error(
      'status \'tags\' option is only supported when used with flat and ' +
      'json options.'
    ));
  }

  return this.graph(dir)
    .bind(this)
    .then(function(graph) {
      if (opts.flat) {
        var root = _.clone(graph);
        root.nodes = deps.uniqRepos(deps.flattenGraph(graph));
        root.nodes = root.nodes.map(function(node) {
          node = _.clone(node);
          delete node.nodes;
          return node;
        });
        root.nodes
        return root;
      }

      return graph;
    })
    .then(function(graph) {
      if (opts.tags) {
        var pairs = traverse(graph).reduce(function(acc, node) {
          if (
            node &&
            node.gitfuse &&
            node.gitfuse.expectedVersion &&
            node !== graph
          ) {
            acc.push([node.name, node.gitfuse.expectedVersion]);
          }
          return acc;
        }, []);
        return _.chain(pairs)
          .sortBy(function(pair) { return pair[0]; })
          .zipObject()
          .value();
      }

      return graph;
    })
    .then(function(graph) {
      if (opts.json) {
        return JSON.stringify(graph, false, '  ').split('\n');
      }
      return deps.visualize(graph);
    })
    .then(function(lines) {
      lines.forEach(function(line) {
        this.emit('write', line);
      }, this);
    });
};
