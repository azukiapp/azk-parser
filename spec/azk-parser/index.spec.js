import h         from '../spec-helper';
import AzkParser from '../../src/azk-parser';
// import System    from '../../src/azk-parser/syntaxes/system';
var bb = require('bluebird');
var spawn = bb.coroutine;

describe('AzkParser:', function() {
  var azkParser;
  before(function () {
    azkParser = new AzkParser();
  });

  it('should parse an Azkfile.js', function () {
    return spawn(function* () {
      var node_example_path = './fixtures/azkfile-examples/node-example-Azkfile.js';
      var systems = yield azkParser.getSystemsFromAzkfile(node_example_path);
      h.expect(systems).to.not.be.undefined;
    })();
  });

  it('should generate an Azkfile.js', function () {
    return spawn(function* () {
      var node_example_path = './fixtures/azkfile-examples/node-example-Azkfile.js';
      var systems = yield azkParser.getSystemsFromAzkfile(node_example_path);
      var ast = systems.convert_to_ast;

      azkParser.saveSystemsToAzkfile(ast, '/tmp/node-example-Azkfile.js');

      h.expect(ast).to.not.be.undefined;
    })();
  });

  // var system001 = new System({ name: 'system001' });
  // systems.addSystem(system001);
  // systems.removeSystem(system001);
  // system001 = systems.find('system001');
  // system001.depends('system002');
  // azkParser.saveSystemsToAzkfile(systems, './Azkfile.js');

});
