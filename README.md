# gitfuse [![Build Status](https://secure.travis-ci.org/gitfuse/gitfuse.png)](http://travis-ci.org/gitfuse/gitfuse)
> Manage projects with nested git dependencies easily.

## What is it?

## API

### constructor(opts)

Create an instance of Gitfuse to work on your project.

#### opts.registry

A registry of repositories Gitfuse should manage, or a function which returns a promise that resolves to the same.

Type: `Array|Function`  
Default: `[]`

#### opts.concurrency

The number of concurrent operations Gitfuse will perform.

Type: `Integer`  
Default: `# of CPUs on Machine`

##### Example

```js
const fuse = new Gitfuse({
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
  ],
  concurrency: 4
});

...or
const fuse = new Gitfuse({
  registry: function () {
    return this.requestFileFromGithub({
      name: 'gitfuse',
      user: 'gitfuse',
      host: 'github.com',
      sshUser: 'git',
      isPrivate: true
    }, 'test/fixtures/registry.json').then(JSON.parse);
  },
  concurrency: 4
});

```

[submodules]: http://git-scm.com/book/en/Git-Tools-Submodules
