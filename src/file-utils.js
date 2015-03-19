import { fs } from 'azk-core';
var bb = require('bluebird');
bb.promisifyAll(fs);

module.exports = {

  readFile: bb.coroutine(function* (full_path) {
    var file_content = yield fs.readFileAsync(full_path);
    return file_content;
  }),

};
