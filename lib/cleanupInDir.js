const fs = require('fs');

module.exports = function(dir) {
  try{
    fs.rmdirSync(dir, {recursive: true});
  } catch {}
};