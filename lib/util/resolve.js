const util = require('util');

var sshUser = function(repo) {
  return repo.sshUser ? repo.sshUser : 'git';
};

var _httpsRemote = function(repo) {
  return util.format(
    'https://%s/%s/%s.git',
    repo.host,
    repo.user,
    repo.name
  );
};

var _gitRemote = function(repo) {
  return util.format(
    '%s@%s:%s/%s.git',
    sshUser(repo),
    repo.host,
    repo.user,
    repo.name
  );
};

exports.remote = function(repo, opts) {
  var fn;
  if (opts && opts.httpsPublic && !repo.isPrivate) {
    fn = _httpsRemote;
  } else {
    fn = _gitRemote;
  }

  return fn(repo);
};

exports.url = function(repo) {
  var protocol = 'git';
  if (repo.isPrivate) {
    protocol += '+ssh';
  }
  return util.format(
    '%s://%s@%s:%s/%s.git',
    protocol,
    sshUser(repo),
    repo.host,
    repo.user,
    repo.name
  );
};
