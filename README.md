# gitfuse [![Build Status](https://secure.travis-ci.org/gitfuse/gitfuse.png)](http://travis-ci.org/gitfuse/gitfuse)
> Manage projects with nested git dependencies easily.

## What is it?
Say you want to develop an application whose parts are comprised of multiple discreet git repositories. At first blush, it might seem like [submodules] could solve this problem. In actuality, they're very cumbersome to work with. If you disagree, I suggest giving it a shot! If you decide they suck (like we did), you can come back here and pick up where you left off.

...more here

## API

### constructor(opts)

Create an instance of Gitfuse to work on your project.

An example utilizing all options:
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
  concurrency: 4,
  logLevel: 1,
  logPrefix: '[myapp]: '
});
```

### API

#### opts.registry

A registry of repos your application is comprised of.

Type: `Array`  
Default: `[]`

[submodules]: http://git-scm.com/book/en/Git-Tools-Submodules
