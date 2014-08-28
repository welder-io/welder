const path = require('path');

const chalk = require('chalk');

const tmpPath = path.resolve(__dirname, '..', '..', '.tmp');

module.exports = {
  registry: require('./registry.json'),
  repoDir: tmpPath,
  depGraph: {
    name: 'test-foo',
    description: 'test repo for gitfuse',
    version: '0.1.0',
    private: true,
    dependencies: {
      lodash: '~2.4.1'
    },
    gitfuseDependencies: {
      'test-bar': 'master',
      'test-qux': 'branch'
    },
    registryEntry: {
      name: 'test-foo',
      user: 'gitfuse',
      host: 'github.com',
      sshUser: 'git',
      isPrivate: false
    },
    gitfuse: {
      cwd: path.join(tmpPath, 'test-foo'),
      isRoot: true,
      repoPath: path.join(tmpPath, 'test-foo'),
      localExists: true,
      isGitRepo: true,
      localSha: '1cc2684d0f250aedfa7398e03cd8fa785ec97e4d',
      remoteSha: false,
      isClean: true
    },
    label: 'test-foo',
    nodes: [
      {
        name: 'test-bar',
        version: '0.2.0',
        description: 'test repo for gitfuse',
        private: true,
        gitfuseDependencies: {
          'test-baz': 'master'
        },
        registryEntry: {
          name: 'test-bar',
          user: 'gitfuse',
          host: 'github.com',
          sshUser: 'git',
          isPrivate: false
        },
        gitfuse: {
          cwd: path.join(tmpPath, 'test-foo'),
          isRoot: false,
          repoPath: path.join(tmpPath, 'test-bar'),
          localExists: true,
          isGitRepo: true,
          localSha: '47e1d99cba8ccb24624c571bbf420b2c09a3e326',
          remoteSha: '47e1d99cba8ccb24624c571bbf420b2c09a3e326',
          isClean: true
        },
        label: 'test-bar',
        nodes: [
          {
            name: 'test-baz',
            version: '0.2.0',
            description: 'test repo for gitfuse',
            private: true,
            gitfuseDependencies: {
              'test-qux': 'master'
            },
            registryEntry: {
              name: 'test-baz',
              user: 'gitfuse',
              host: 'github.com',
              sshUser: 'git',
              isPrivate: false
            },
            gitfuse: {
              cwd: path.join(tmpPath, 'test-foo'),
              isRoot: false,
              repoPath: path.join(tmpPath, 'test-baz'),
              localExists: true,
              isGitRepo: true,
              localSha: '77b8d34410b2bb0e0769102d7056d13aea4f4075',
              remoteSha: '77b8d34410b2bb0e0769102d7056d13aea4f4075',
              isClean: true
            },
            label: 'test-baz',
            nodes: [
              {
                name: 'test-qux',
                description: 'test repo for gitfuse',
                version: '0.1.0',
                private: true,
                registryEntry: {
                  name: 'test-qux',
                  user: 'gitfuse',
                  host: 'github.com',
                  sshUser: 'git',
                  isPrivate: false
                },
                gitfuse: {
                  cwd: path.join(tmpPath, 'test-foo'),
                  isRoot: false,
                  repoPath: path.join(tmpPath, 'test-qux'),
                  localExists: true,
                  isGitRepo: true,
                  localSha: '3e08d75d3eb59762f36d2e39c00275db9da2d16d',
                  remoteSha: '3e08d75d3eb59762f36d2e39c00275db9da2d16d',
                  isClean: true
                },
                label: 'test-qux',
                nodes: []
              }
            ]
          }
        ]
      },
      {
        name: 'test-qux',
        description: 'test repo for gitfuse',
        version: '0.1.0',
        private: true,
        registryEntry: {
          name: 'test-qux',
          user: 'gitfuse',
          host: 'github.com',
          sshUser: 'git',
          isPrivate: false
        },
        gitfuse: {
          cwd: path.join(tmpPath, 'test-foo'),
          isRoot: false,
          repoPath: path.join(tmpPath, 'test-qux'),
          localExists: true,
          isGitRepo: true,
          localSha: '3e08d75d3eb59762f36d2e39c00275db9da2d16d',
          remoteSha: '0685562ba8d4a26a2004b3fcfcdb2166ef6265e3',
          isClean: true
        },
        label: 'test-qux',
        nodes: []
      }
    ]
  }

};

module.exports.flatDepGraph = [
  module.exports.depGraph.nodes[0],
  module.exports.depGraph.nodes[0].nodes[0]
];

module.exports.depVisualize = [
  'test-foo ' + chalk.green('(1cc2684d)'),
  '├─┬ test-bar ' + chalk.green('(47e1d99c)'),
  '│ └─┬ test-baz ' + chalk.green('(77b8d344)'),
  '│   └── test-qux ' + chalk.green('(3e08d75d)'),
  '└── test-qux ' + chalk.red('(3e08d75d)') + ' (expected 0685562b)'
];
