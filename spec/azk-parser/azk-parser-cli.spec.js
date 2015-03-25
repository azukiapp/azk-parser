import h            from '../spec-helper';
import AzkParserCli from '../../src/azk-parser/azk-parser-cli';
// import fileUtils from '../../src/file-utils';
// import Parser    from '../../src/parser';
// var parser = new Parser();
// import System    from '../../src/azk-parser/syntaxes/system';
var bb = require('bluebird');
var spawn = bb.coroutine;

// var node_azkfile_content = require('../../../fixtures/azkfile-examples/node-stringified')();
// var feedbin_azkfile_content = require('../../../fixtures/azkfile-examples/feedbin-Azkfile')();

describe('AzkParserCli:', function() {
  var azkParserCli;
  //, node_example_systems;

  // var logCode = function(systems) {
  //   var systems_ast = systems.convert_to_ast();
  //   var code = azkParserCli.generateAzkfileFromAst(systems_ast);
  //   console.log(code.toString());
  // };

  azkParserCli = new AzkParserCli();

  it('should instantiate AzkParserCli', function () {
    h.expect(azkParserCli).to.not.be.undefined;
  });

  it('should get systems from an Azkfile.js', function () {
    return spawn(function* () {
      var node_azkfile_path = './fixtures/azkfile-examples/node-example-Azkfile.js';
      yield azkParserCli.load(node_azkfile_path);
      h.expect(azkParserCli._systems_list._systems).to.have.length(1);
    })();
  });

  it('should get systems from an Azkfile.js', function () {
    return spawn(function* () {
      var node_azkfile_path = './fixtures/azkfile-examples/node-stringified.js';
      yield azkParserCli.load(node_azkfile_path);
      var systems_string_list = azkParserCli.listAllSystems();
      h.expect(systems_string_list).to.be.deep.equal(['node-example']);
    })();
  });

});
