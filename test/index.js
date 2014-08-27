require('./lib/util/deps');
require('./lib/util/exec');
require('./lib/util/git');
require('./lib/util/github');
//require('./lib/util/link');
//require('./lib/util/logger');
require('./lib/util/npm');
require('./lib/util/pfs');
require('./lib/util/pkg');
require('./lib/util/promise');
require('./lib/util/resolve');

describe('Gitfuse', function() {

  describe('constructor', function() {

  });

  require('./lib/init');
  require('./lib/find');
  require('./lib/dep_state');
  require('./lib/graph');

});
