const path = require('path');

const tmpDir = path.resolve(__dirname, '..', '..', '.tmp');

module.exports = {
  "name": "test-foo",
  "description": "test repo for gitfuse",
  "version": "0.2.0",
  "private": true,
  "dependencies": {
    "lodash": "~2.4.1"
  },
  "gitfuseDependencies": {
    "test-bar": "~0.3.0",
    "test-qux": "~0.2.0"
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
    "isClean": true
  },
  "label": "test-foo",
  "nodes": [
    {
      "name": "test-bar",
      "version": "0.3.2",
      "description": "test repo for gitfuse",
      "private": true,
      "gitfuseDependencies": {
        "test-baz": "~0.3.0"
      },
      "registryEntry": {
        "name": "test-bar",
        "user": "welder-io",
        "host": "github.com",
        "sshUser": "git",
        "isPrivate": false,
        "version": "0.3.2"
      },
      "welder": {
        "cwd": path.join(tmpDir, 'test-foo'),
        "isRoot": false,
        "repoPath": path.join(tmpDir, 'test-bar'),
        "localExists": true,
        "isGitRepo": true,
        "localVersion": "0.3.2",
        "expectedVersion": "0.3.2",
        "localSha": "dde43cd5b60400d8257f7c752c3408d20f15f6d4",
        "remoteSha": "dde43cd5b60400d8257f7c752c3408d20f15f6d4",
        "isClean": true
      },
      "label": "test-bar",
      "nodes": [
        {
          "name": "test-baz",
          "version": "0.3.2",
          "description": "test repo for gitfuse",
          "private": true,
          "gitfuseDependencies": {
            "test-qux": "~0.2.0"
          },
          "registryEntry": {
            "name": "test-baz",
            "user": "welder-io",
            "host": "github.com",
            "sshUser": "git",
            "isPrivate": false,
            "version": "0.3.2"
          },
          "welder": {
            "cwd": path.join(tmpDir, 'test-foo'),
            "isRoot": false,
            "repoPath": path.join(tmpDir, 'test-baz'),
            "localExists": true,
            "isGitRepo": true,
            "localVersion": "0.3.2",
            "expectedVersion": "0.3.2",
            "localSha": "eb31e6647ad023a3cb2386d266b0d125d656041e",
            "remoteSha": "eb31e6647ad023a3cb2386d266b0d125d656041e",
            "isClean": true
          },
          "label": "test-baz",
          "nodes": [
            {
              "name": "test-qux",
              "description": "test repo for gitfuse",
              "version": "0.2.2",
              "private": true,
              "registryEntry": {
                "name": "test-qux",
                "user": "welder-io",
                "host": "github.com",
                "sshUser": "git",
                "isPrivate": false,
                "version": "0.2.2"
              },
              "welder": {
                "cwd": path.join(tmpDir, 'test-foo'),
                "isRoot": false,
                "repoPath": path.join(tmpDir, 'test-qux'),
                "localExists": true,
                "isGitRepo": true,
                "localVersion": "0.2.2",
                "expectedVersion": "0.2.2",
                "localSha": "aecec7eeaef2ca59f5ee1c1c78b3a2fa68f223d9",
                "remoteSha": "aecec7eeaef2ca59f5ee1c1c78b3a2fa68f223d9",
                "isClean": true
              },
              "label": "test-qux",
              "nodes": []
            }
          ]
        }
      ]
    },
    {
      "name": "test-qux",
      "description": "test repo for gitfuse",
      "version": "0.2.2",
      "private": true,
      "registryEntry": {
        "name": "test-qux",
        "user": "welder-io",
        "host": "github.com",
        "sshUser": "git",
        "isPrivate": false,
        "version": "0.2.2"
      },
      "welder": {
        "cwd": path.join(tmpDir, 'test-foo'),
        "isRoot": false,
        "repoPath": path.join(tmpDir, 'test-qux'),
        "localExists": true,
        "isGitRepo": true,
        "localVersion": "0.2.2",
        "expectedVersion": "0.2.2",
        "localSha": "aecec7eeaef2ca59f5ee1c1c78b3a2fa68f223d9",
        "remoteSha": "aecec7eeaef2ca59f5ee1c1c78b3a2fa68f223d9",
        "isClean": true
      },
      "label": "test-qux",
      "nodes": []
    }
  ]
};
