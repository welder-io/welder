const util = require('util');

var sshUser = function(repo) {
  return repo.sshUser ? repo.sshUser : 'git';
};

exports.remote = function(repo) {
  return util.format(
    'git://%s@%s/%s/%s.git',
    sshUser(repo),
    repo.host,
    repo.user,
    repo.name
  );
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
