import h from './spec-helper';
import fileUtils from '../src/file-utils';
var bb = require('bluebird');
var spawn = bb.coroutine;

describe('fileUtils', function() {

  it('should read a file', function () {
    return spawn(function* () {
      var file_content = yield fileUtils.readFile(__filename);
      h.expect(file_content).not.been.undefined;
    })();
  });

});
