import h         from '../spec-helper';
import AzkParser from '../../src/azk-parser';
import fileUtils from '../../src/file-utils';
import Parser    from '../../src/parser';
var parser = new Parser();
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
      // get systems
      var node_example_path = './fixtures/azkfile-examples/node-example-Azkfile.js';
      var systems = yield azkParser.getSystemsFromAzkfile(node_example_path);

      // get ast
      var ast = systems.convert_to_ast;

      // generate code
      azkParser.saveSystemsToAzkfile(ast, '/tmp/node-example-Azkfile.js');

      // check generation
      var generated_content = yield fileUtils.read('/tmp/node-example-Azkfile.js');
      var generatade_ast = parser.parse(generated_content.toString()).syntax;
      var properties_ast = generatade_ast.program.body[0].expression.arguments[0].properties;
      /**/require('azk-core').dlog(properties_ast, "properties_ast", 2);/*-debug-*/

      h.expect(properties_ast).to.have.length(1);
    })();
  });

  // var system001 = new System({ name: 'system001' });
  // systems.addSystem(system001);
  // systems.removeSystem(system001);
  // system001 = systems.find('system001');
  // system001.depends('system002');
  // azkParser.saveSystemsToAzkfile(systems, './Azkfile.js');

});
