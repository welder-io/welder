# gitfuse
> Manage projects with nested git dependencies easily.

## What is it?

## API

### `constructor(opts)`

Create an instance of Gitfuse to work on your project.

#### opts.concurrency

The number of concurrent operations Gitfuse will perform.

Type: `Integer`  
Default: `# of CPUs`

#### opts.moduleDir

Gitfuse will make symlinks to dependencies inside each repository under this directory.

Type: `String`  
Default: `node_modules`

#### opts.configurationFile

Gitfuse will look for this configuration file when tracing the dependency graph. *Must be JSON.*

Type: `String`  
Default: `package.json`

#### opts.dependencyKey

Gitfuse will look at this key in your configuration file to find its dependencies.

Type: `String`  
Default: `gitfuseDependencies`

#### opts.installCommand

Gitfuse will run this command in the folder of each dependency it clones.

Type: `String`  
Default: `npm install`

#### opts.registry

A registry of repositories Gitfuse should manage, or a function which returns a promise that resolves to the same.

Type: `Array|Function`  
Default: `[]`

##### Usage

Using async registry retreival:
```js
const Gitfuse = require('./');
const fuse = new Gitfuse({
  concurrency: 4,
  moduleDir: 'node_modules',
  configurationFile: 'package.json',
  dependencyKey: 'gitfuseDependencies',
  installCommand: 'npm install',
  registry: function () {
    return this.requestFileFromGithub({
      name: 'gitfuse',
      user: 'gitfuse',
      host: 'github.com',
      sshUser: 'git',
      isPrivate: true
    }, 'test/fixtures/registry.json').then(JSON.parse);
  },
});
```

Using sync registry definition:
```js
const Gitfuse = require('./');
const fuse = new Gitfuse({
  concurrency: 4,
  moduleDir: 'node_modules',
  configurationFile: 'package.json',
  dependencyKey: 'gitfuseDependencies',
  installCommand: 'npm install',
  registry: [
    {
      name: 'test-foo',
      user: 'gitfuse',
      host: 'github.com',
      sshUser: 'git',
      isPrivate: false
    },
    {
      name: 'test-bar',
      user: 'gitfuse',
      host: 'github.com',
      sshUser: 'git',
      isPrivate: false
    },
    {
      name: 'test-baz',
      user: 'gitfuse',
      host: 'github.com',
      sshUser: 'git',
      isPrivate: false
    },
    {
      name: 'test-qux',
      user: 'gitfuse',
      host: 'github.com',
      sshUser: 'git',
      isPrivate: false
    }
  ]
});
```

### `events`

Gitfuse subclasses [EventEmitter](http://nodejs.org/api/events.html#events_class_events_eventemitter).  The following is available on each instance:

#### .on('debug', Function)
Verbose logging typically meant to be ignored unless explicitly requested.

#### .on('write', Function)
Standard logging for status messages during execution.

#### .on('ok', Function)
Standard logging for success messages during execution.

#### .on('error', Function)
Standard logging for failure messages during execution.

### `init(dir, opts)`

Use this to initialize a directory with all repositories your instance of Gitfuse is managing.

Does the following:

1. Loads registry, or uses one explicitly provided.
2. Checks specified directory for existing repositories.
3. Clones any repositories that are missing.
4. Symlinks all repositories together.
4. Runs `npm install` inside each new repository.

#### opts.repos

The repositories initialize.  If none provided, the entire registry will be used.

Type: `Array`  
Default: `this.loadRegistry()`

Example entry format:
```js
{
  name: 'test-foo',
  user: 'gitfuse',
  host: 'github.com',
  sshUser: 'git',
  isPrivate: false
}
```

Usage:
```js
const Gitfuse = require('./');
const chalk = require('chalk');
const DEBUG = true;

const fuse = new Gitfuse({
  registry: function () {
    return this.requestFileFromGithub({
      name: 'gitfuse',
      user: 'gitfuse',
      host: 'github.com',
      sshUser: 'git',
      isPrivate: true
    }, 'test/fixtures/registry.json').then(JSON.parse);
  }
});
fuse.on('debug', function(msg) {
  if (DEBUG) {
    console.log(msg);
  }
});
fuse.on('write', function(msg) {
  console.log(msg);
});
fuse.on('ok', function(msg) {
  console.log(chalk.green(msg));
});
fuse.on('error', function(msg) {
  console.log(chalk.red(msg));
});

fuse.repos('./test');
```

### `graph(dir)`

Returns a promise which resolves to a dependency graph of the provided directory.

### `status(dir)`

Emits write events which display a hierarchical representation of the current dependency graph.

### `sync(dir)`



### `find(name)`

Write me!

### `loadRegistry()`

Write me!

### `requestFileFromGithub(registryEntry, filename)`

Write me!
