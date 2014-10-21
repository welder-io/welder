const util = require('util');

const promise = require('./promise');
const request = promise.promisify(require('request').get);
const ghAuth = promise.promisify(require('ghauth'));

var getToken = function(host) {
  var configName = 'gifuse';
  var authHost = 'api.github.com';
  if (host !== 'github.com') {
    configName = 'gitfuse-' + host
    authHost = host + '/api/v3';
  }
  return ghAuth({
    configName: configName,
    scopes: ['repo'],
    note: 'gitfuse',
    authUrl: 'https://' + host + '/authorizations',
  });
};

var fileUrl = function(dep, file) {
  var host = 'api.github.com';
  var template = '/repos/%s/%s/contents/%s?ref=%s';
  var args = [dep.user, dep.name, file, dep.version || 'master'];
  if (dep.host !== 'github.com') {
    host = dep.host + '/api/v3';
  }
  args.unshift('https://' + host + template);
  return util.format.apply(util, args);
};

exports.requestFile = function(registryEntry, filename) {
  var ready = promise.resolve();
  if (registryEntry.isPrivate) {
    ready = getToken(registryEntry.host);
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
    return request(config)
      .get(1)
      .then(JSON.parse)
      .then(function(data) {
        // What encodings other than base64 can happen? Can Buffer decode those?
        // If utf8 or utf-8 is a possible encoding Buffer will still work
        // for those.
        return new Buffer(data.content, data.encoding).toString();
      });
  });
};
