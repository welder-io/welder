const path = require('path');

const tmpDir = path.resolve(__dirname, '..', '..', '.tmp');

module.exports = {
  "name": "test-foo",
  "version": "0.2.0",
  "gitfuseDependencies": {
    "test-bar": "0.3.1",
    "test-baz": "0.3.1",
    "test-qux": "0.2.1"
  },
  "registryEntry": {
    "name": "test-foo",
    "user": "welder-io",
    "host": "github.com",
    "sshUser": "git",
    "isPrivate": false
  },
  "welder": {
    "cwd": path.join(tmpDir, 'test-foo'),
    "isRoot": true,
    "repoPath": path.join(tmpDir, 'test-foo'),
    "localExists": true,
    "isGitRepo": true,
    "localVersion": "0.2.0",
    "expectedVersion": "0.2.0",
    "localSha": "65b3c7fc221c57d009ab3a608714e7e59f0a08e5",
    "remoteSha": "65b3c7fc221c57d009ab3a608714e7e59f0a08e5",
    "isClean": false
  },
  "shrinkwrap": {
    "name": "test-foo",
    "version": "0.2.0",
    "sha": "65b3c7fc221c57d009ab3a608714e7e59f0a08e5",
    "nodeDependencies": {
      "lodash": {
        "from": "lodash@>=2.4.1 <2.5.0",
        "resolved": "https://registry.npmjs.org/lodash/-/lodash-2.4.1.tgz",
        "version": "2.4.1"
      }
    },
    "gitfuseDependencies": [
      {
        "name": "test-bar",
        "version": "0.3.1",
        "sha": "29e63d9882261f9982c23f3d2b00584bc8920fc9",
        "nodeDependencies": {}
      },
      {
        "name": "test-baz",
        "version": "0.3.1",
        "sha": "59df9304dd163f04f0f9057338ee155213f52b09",
        "nodeDependencies": {}
      },
      {
        "name": "test-qux",
        "version": "0.2.1",
        "sha": "1a5ce93c395cecd01cd4b3afe0a326e3b5123608",
        "nodeDependencies": {}
      }
    ]
  },
  "label": "test-foo",
  "nodes": [
    {
      "name": "test-bar",
      "gitfuseDependencies": {},
      "registryEntry": {
        "name": "test-bar",
        "user": "welder-io",
        "host": "github.com",
        "sshUser": "git",
        "isPrivate": false,
        "version": "0.3.1"
      },
      "welder": {
        "cwd": path.join(tmpDir, 'test-foo'),
        "isRoot": false,
        "repoPath": path.join(tmpDir, 'test-bar'),
        "localExists": true,
        "isGitRepo": true,
        "localVersion": "0.3.1",
        "expectedVersion": "0.3.1",
        "localSha": "29e63d9882261f9982c23f3d2b00584bc8920fc9",
        "remoteSha": "29e63d9882261f9982c23f3d2b00584bc8920fc9",
        "isClean": true
      },
      "shrinkwrap": {
        "name": "test-bar",
        "version": "0.3.1",
        "sha": "29e63d9882261f9982c23f3d2b00584bc8920fc9",
        "nodeDependencies": {}
      },
      "label": "test-bar",
      "nodes": []
    },
    {
      "name": "test-baz",
      "gitfuseDependencies": {},
      "registryEntry": {
        "name": "test-baz",
        "user": "welder-io",
        "host": "github.com",
        "sshUser": "git",
        "isPrivate": false,
        "version": "0.3.1"
      },
      "welder": {
        "cwd": path.join(tmpDir, 'test-foo'),
        "isRoot": false,
        "repoPath": path.join(tmpDir, 'test-baz'),
        "localExists": true,
        "isGitRepo": true,
        "localVersion": "0.3.1",
        "expectedVersion": "0.3.1",
        "localSha": "59df9304dd163f04f0f9057338ee155213f52b09",
        "remoteSha": "59df9304dd163f04f0f9057338ee155213f52b09",
        "isClean": true
      },
      "shrinkwrap": {
        "name": "test-baz",
        "version": "0.3.1",
        "sha": "59df9304dd163f04f0f9057338ee155213f52b09",
        "nodeDependencies": {}
      },
      "label": "test-baz",
      "nodes": []
    },
    {
      "name": "test-qux",
      "gitfuseDependencies": {},
      "registryEntry": {
        "name": "test-qux",
        "user": "welder-io",
        "host": "github.com",
        "sshUser": "git",
        "isPrivate": false,
        "version": "0.2.1"
      },
      "welder": {
        "cwd": path.join(tmpDir, 'test-foo'),
        "isRoot": false,
        "repoPath": path.join(tmpDir, 'test-qux'),
        "localExists": true,
        "isGitRepo": true,
        "localVersion": "0.2.1",
        "expectedVersion": "0.2.1",
        "localSha": "1a5ce93c395cecd01cd4b3afe0a326e3b5123608",
        "remoteSha": "1a5ce93c395cecd01cd4b3afe0a326e3b5123608",
        "isClean": true
      },
      "shrinkwrap": {
        "name": "test-qux",
        "version": "0.2.1",
        "sha": "1a5ce93c395cecd01cd4b3afe0a326e3b5123608",
        "nodeDependencies": {}
      },
      "label": "test-qux",
      "nodes": []
    }
  ]
};
