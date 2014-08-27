const fs = require('fs');
const path = require('path');

exports.loadFrom = function(dir) {
  var pkg = null;
  var absDir = path.resolve(dir);
  try {
    absDir = fs.readlinkSync(absDir);
  } catch (e) {}
  try {
    pkg = require(path.join(absDir, 'package'));
  } catch (e) { }
  return pkg;
};
