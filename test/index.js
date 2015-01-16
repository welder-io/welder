describe('Welder', function() {
  require('./lib/util/deps');
  require('./lib/util/exec');
  require('./lib/util/git');
  require('./lib/util/github');
  //require('./lib/util/link');
  //require('./lib/util/logger');
  require('./lib/util/pfs');
  require('./lib/util/promise');
  require('./lib/util/resolve');

  require('./lib/find');
  require('./lib/graph');
  require('./lib/init');
  require('./lib/shrinkwrap');
  require('./lib/sync');

});
