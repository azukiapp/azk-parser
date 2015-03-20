import h from '../spec-helper';
import AzkParser from '../../src/azk-parser';

// import Generator from '../../src/generator';
// var bb = require('bluebird');
// var spawn = bb.coroutine;
// var generator = new Generator();

describe('AzkParser', function() {
  var azkParser;
  before(function () {
    azkParser = new AzkParser();
  });

  it('should generate a system', function () {
    var code = azkParser._generateSystem('system001');
    h.expect(code).to.eql(`system001: {
}`);
  });

});
