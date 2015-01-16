const path = require('path');

const chalk = require('chalk');

const tmpPath = path.resolve(__dirname, '..', '..', '.tmp');

module.exports = {
  registry: require('./registry'),
  repoDir: tmpPath,
  depGraph: require('./dep_graph'),
  shrinkwrap: {
    expect: require('./shrinkwrap_expect'),
  },
};

module.exports.flatDepGraph = [
  module.exports.depGraph.nodes[0],
  module.exports.depGraph.nodes[0].nodes[0]
];

module.exports.depVisualize = [
  'test-foo / 0.1.0 / ' + chalk.green('1cc2684d'),
  '├─┬ test-bar / master / ' + chalk.green('47e1d99c'),
  '│ └─┬ test-baz / master / ' + chalk.green('77b8d344'),
  '│   └── test-qux / master / ' + chalk.green('3e08d75d'),
  '└── test-qux / branch / ' + chalk.red('3e08d75d') + ' / expected ' + chalk.green('0685562b')
];
