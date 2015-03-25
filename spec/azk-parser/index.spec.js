import h         from '../spec-helper';
import AzkParser from '../../src/azk-parser';
import fileUtils from '../../src/file-utils';
import Parser    from '../../src/parser';
var parser = new Parser();
import System    from '../../src/azk-parser/syntaxes/system';
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

      // generate code
      azkParser.saveSystemsToAzkfile(systems, '/tmp/node-example-Azkfile.js');

      // check generation
      var generated_content = yield fileUtils.read('/tmp/node-example-Azkfile.js');

      var generated_ast = parser.parse(generated_content.toString()).syntax;
      var properties_ast = generated_ast.program.body[0].expression.arguments[0].properties;

      h.expect(properties_ast).to.have.length(1);
    })();
  });

  it('should generate the same Azkfile.js', function () {
    return spawn(function* () {
      // get systems
      var node_example_path = './fixtures/azkfile-examples/node-example-Azkfile.js';
      var original_code = yield fileUtils.read(node_example_path);
      original_code = original_code.toString();

      var systems = yield azkParser.getSystemsFromAzkfileToUpdate(node_example_path);
      azkParser.saveSystemsToAzkfile(systems, '/tmp/node-example-Azkfile.js');

      // check generation
      var generated_content = yield fileUtils.read('/tmp/node-example-Azkfile.js');
      generated_content = generated_content.toString();

      h.expect(generated_content).to.equal(original_code);
    })();
  });

  it('should generate the same Azkfile.js with a systems array', function () {
    return spawn(function* () {
      // get systems
      var node_example_path = './fixtures/azkfile-examples/node-example-Azkfile.js';
      var original_code = yield fileUtils.read(node_example_path);
      original_code = original_code.toString();

      var systems = yield azkParser.getSystemsFromAzkfileToUpdate(node_example_path);
      azkParser.saveSystemsToAzkfile(systems, '/tmp/node-example-Azkfile.js');

      // check generation
      var generated_content = yield fileUtils.read('/tmp/node-example-Azkfile.js');
      generated_content = generated_content.toString();

      h.expect(generated_content).to.equal(original_code);
      h.expect(systems._systems).to.have.length(1);
    })();
  });

  it('should get system name', function () {
    return spawn(function* () {
      // get systems
      var node_example_path = './fixtures/azkfile-examples/node-example-Azkfile.js';
      var original_code = yield fileUtils.read(node_example_path);
      original_code = original_code.toString();

      var systems = yield azkParser.getSystemsFromAzkfileToUpdate(node_example_path);
      azkParser.saveSystemsToAzkfile(systems, '/tmp/node-example-Azkfile.js');

      // check generation
      var generated_content = yield fileUtils.read('/tmp/node-example-Azkfile.js');
      generated_content = generated_content.toString();

      h.expect(generated_content).to.equal(original_code);
      h.expect(systems._systems[0].name).to.have.equal('node-example');
    })();
  });

  it('should add a dependency to system', function () {
    return spawn(function* () {
      // get systems
      var node_example_path = './fixtures/azkfile-examples/node-example-Azkfile.js';
      var original_code = yield fileUtils.read(node_example_path);
      original_code = original_code.toString();

      var systems = yield azkParser.getSystemsFromAzkfileToUpdate(node_example_path);

      systems._systems[0].addDependency('redis');

      azkParser.saveSystemsToAzkfile(systems, '/tmp/node-example-Azkfile.js');

      // check generation
      var generated_content = yield fileUtils.read('/tmp/node-example-Azkfile.js');
      generated_content = generated_content.toString();

      console.log(generated_content.toString());

      var generated_ast = parser.parse(generated_content).syntax;
      var depends_ast = generated_ast.program.body[0].expression.arguments[0].properties[0];
      var depends_count = new System({ system_ast: depends_ast })._depends;

      h.expect(systems._systems[0].name).to.have.equal('node-example');
      h.expect(depends_count).to.have.length(1);
    })();
  });

  // var system001 = new System({ name: 'system001' });
  // systems.addSystem(system001);
  // systems.removeSystem(system001);
  // system001 = systems.find('system001');
  // system001.depends('system002');
  // azkParser.saveSystemsToAzkfile(systems, './Azkfile.js');

});
