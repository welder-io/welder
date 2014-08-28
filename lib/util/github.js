const util = require('util');

const promise = require('./promise');
const request = promise.promisify(require('request').get);
const ghAuth = promise.promisify(require('ghauth'));

var getToken = function() {
  return ghAuth({
    configName: 'gitfuse.json',
    scopes: ['repo'],
    note: 'gitfuse'
  });
};

var fileUrl = function(dep, file) {
  return util.format(
    // TODO: allow a custom raw host
    'https://raw.githubusercontent.com/%s/%s/%s/%s',
    dep.user,
    dep.name,
    dep.version || 'master',
    file
  );
};

exports.requestFile = function(registryEntry, filename) {
  var ready = promise.resolve();
  if (registryEntry.isPrivate) {
    ready = getToken();
  }
  return ready.then(function(token) {
    var config = {
      url: fileUrl(registryEntry, filename),
    };
    if (token) {
      config.headers = {
        'Authorization': 'token ' + token.token
      };
    }
    return request(config).get(1);
  });
};
