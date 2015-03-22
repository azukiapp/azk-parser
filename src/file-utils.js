var fs = require('fs');
var bb = require('bluebird');
bb.promisifyAll(fs);
var spawn = bb.coroutine;

module.exports = {
  /**
   * read :: fs.readFile
   * @param  {String} full_path  file fullpath
   * @return {String}            file content
   */
  read: spawn(function* (full_path) {
    var file_content = yield fs.readFileAsync(full_path);
    return file_content;
  }),

  /**
   * stat :: fs.stat
   * @param  {string} full_path     file's fullpath to get stat
   * @return {object} fsStat        stat functions: isFile, isDirectory, isBlockDevice, isCharacterDevice, isSymbolicLink, isFIFO, isSocket
   */
  stat: spawn(function* (full_path) {
    var fsStat = yield fs.statAsync(full_path);
    return fsStat;
  }),

  /**
   * write :: fs.writeFile
   * @param  {String} full_path  file fullpath
   * @param  {String} data       file content
   */
  write: spawn(function* (full_path, data) {
    yield fs.writeFileAsync(full_path, data);
  }),

};
