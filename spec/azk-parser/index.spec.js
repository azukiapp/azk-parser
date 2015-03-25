import h         from '../spec-helper';
import AzkParser from '../../src/azk-parser';
// import fileUtils from '../../src/file-utils';
// import Parser    from '../../src/parser';
// var parser = new Parser();
// import System    from '../../src/azk-parser/syntaxes/system';
// var bb = require('bluebird');
// var spawn = bb.coroutine;

var node_azkfile_content = require('../../../fixtures/azkfile-examples/node-stringified')();
var feedbin_azkfile_content = require('../../../fixtures/azkfile-examples/feedbin-Azkfile')();

describe('AzkParser:', function() {
  var azkParser, node_example_systems;

  // var logCode = function(systems) {
  //   var systems_ast = systems.convert_to_ast();
  //   var code = azkParser.generateAzkfileFromAst(systems_ast);
  //   console.log(code.toString());
  // };

  describe('node-example:', function() {
    beforeEach(function () {
      azkParser = new AzkParser();
      node_example_systems = azkParser.parse(node_azkfile_content);
    });

    it('should parse an Azkfile.js and get 1 system', function () {
      h.expect(node_example_systems).to.not.be.undefined;
      h.expect(node_example_systems._all_systems).to.have.length(1);
    });

    it('should get first system name', function () {
      h.expect(node_example_systems._all_systems[0].name).to.be.equal('node-example');
    });

    it('should change first system name', function () {
      var newSystemName = 'node-better-example';

      var system = node_example_systems._all_systems[0];
      system.name = newSystemName;
      h.expect(system.name).to.be.equal(newSystemName);
    });

    it('should name still be changed when regenerated', function () {
      var newSystemName = 'node-better-example';
      var system = node_example_systems._all_systems[0];
      system.name = newSystemName;

      var systems_ast = node_example_systems.convert_to_ast();
      var code = azkParser.generateAzkfileFromAst(systems_ast);

      h.expect(code.indexOf(newSystemName)).to.not.be.equal(-1);
    });

    it('should get dependencies to a system', function () {
      var node_example_system = node_example_systems._all_systems[0];
      h.expect(node_example_system._depends).to.have.length(0);
    });

    it('should add a dependency to a system', function () {
      var node_example_system = node_example_systems._all_systems[0];
      node_example_system.addDependency('jeep');
      h.expect(node_example_system._depends).to.have.length(1);
    });

    it('should generate with dependencies', function () {
      var node_example_system = node_example_systems._all_systems[0];
      node_example_system.addDependency('jeep');
      node_example_system.addDependency('range');

      var systems_ast = node_example_systems.convert_to_ast();
      var code = azkParser.generateAzkfileFromAst(systems_ast);

      // logCode(node_example_systems);

      h.expect(code.indexOf('jeep')).to.not.be.equal(-1);
      h.expect(code.indexOf('range')).to.not.be.equal(-1);
    });
  });

  describe('feedbin:', function() {
    var node_example_systems, feedbin_example_systems;

    beforeEach(function () {
      azkParser = new AzkParser();
      node_example_systems = azkParser.parse(node_azkfile_content);
      feedbin_example_systems = azkParser.parse(feedbin_azkfile_content);
    });

    it('should parse feedbin Azkfile.js and get 1 system', function () {
      h.expect(feedbin_example_systems).to.not.be.undefined;
      h.expect(feedbin_example_systems._all_systems).to.have.length(9);
    });

    it('should add a new system to an existing systems', function () {
      var node_example_system = node_example_systems._all_systems[0];
      feedbin_example_systems.addSystem(node_example_system);
      h.expect(feedbin_example_systems._all_systems).to.have.length(10);
    });

    // azk-parse -i ./azkfile1 --add ./azkfile2
    //  [-] sys1
    //  [-] sys2
    //  [-] sys3

  });

  // it('should parse and generate the same Azkfile.js', function () {
  //   return spawn(function* () {
  //     // get systems
  //     var node_example_path = './fixtures/azkfile-examples/node-example-Azkfile.js';
  //     var systems = yield azkParser.getSystemsFromAzkfile(node_example_path);

  //     // generate code
  //     azkParser.saveSystemsToAzkfile(systems, '/tmp/node-example-Azkfile.js');

  //     // check generation
  //     var generated_content = yield fileUtils.read('/tmp/node-example-Azkfile.js');
  //     var generated_ast = parser.parse(generated_content.toString()).syntax;
  //     var properties_ast = generated_ast.program.body[0].expression.arguments[0].properties;

  //     h.expect(properties_ast).to.have.length(1);
  //   })();
  // });

  // it('should generate the same Azkfile.js', function () {
  //   return spawn(function* () {
  //     // get systems
  //     var node_example_path = './fixtures/azkfile-examples/node-example-Azkfile.js';
  //     var original_code = yield fileUtils.read(node_example_path);
  //     original_code = original_code.toString();

  //     var systems = yield azkParser.getSystemsFromAzkfileToUpdate(node_example_path);
  //     azkParser.saveSystemsToAzkfile(systems, '/tmp/node-example-Azkfile.js');

  //     // check generation
  //     var generated_content = yield fileUtils.read('/tmp/node-example-Azkfile.js');
  //     generated_content = generated_content.toString();

  //     h.expect(generated_content).to.equal(original_code);
  //   })();
  // });

  // it('should generate the same Azkfile.js with a systems array', function () {
  //   return spawn(function* () {
  //     // get systems
  //     var node_example_path = './fixtures/azkfile-examples/node-example-Azkfile.js';
  //     var original_code = yield fileUtils.read(node_example_path);
  //     original_code = original_code.toString();

  //     var systems = yield azkParser.getSystemsFromAzkfileToUpdate(node_example_path);
  //     azkParser.saveSystemsToAzkfile(systems, '/tmp/node-example-Azkfile.js');

  //     // check generation
  //     var generated_content = yield fileUtils.read('/tmp/node-example-Azkfile.js');
  //     generated_content = generated_content.toString();

  //     h.expect(generated_content).to.equal(original_code);
  //     h.expect(systems._all_systems).to.have.length(1);
  //   })();
  // });

  // it('should get system name', function () {
  //   return spawn(function* () {
  //     // get systems
  //     var node_example_path = './fixtures/azkfile-examples/node-example-Azkfile.js';
  //     var original_code = yield fileUtils.read(node_example_path);
  //     original_code = original_code.toString();

  //     var systems = yield azkParser.getSystemsFromAzkfileToUpdate(node_example_path);
  //     azkParser.saveSystemsToAzkfile(systems, '/tmp/node-example-Azkfile.js');

  //     // check generation
  //     var generated_content = yield fileUtils.read('/tmp/node-example-Azkfile.js');
  //     generated_content = generated_content.toString();

  //     h.expect(generated_content).to.equal(original_code);
  //     h.expect(systems._all_systems[0].name).to.have.equal('node-example');
  //   })();
  // });

  // it('should add a dependency to system', function () {
  //   return spawn(function* () {
  //     // get systems
  //     var node_example_path = './fixtures/azkfile-examples/node-example-Azkfile.js';
  //     var original_code = yield fileUtils.read(node_example_path);
  //     original_code = original_code.toString();

  //     var systems = yield azkParser.getSystemsFromAzkfileToUpdate(node_example_path);

  //     systems._all_systems[0].addDependency('redis');

  //     azkParser.saveSystemsToAzkfile(systems, '/tmp/node-example-Azkfile.js');

  //     // check generation
  //     var generated_content = yield fileUtils.read('/tmp/node-example-Azkfile.js');
  //     generated_content = generated_content.toString();

  //     console.log(generated_content.toString());

  //     var generated_ast = parser.parse(generated_content).syntax;
  //     var depends_ast = generated_ast.program.body[0].expression.arguments[0].properties[0];
  //     var depends_count = new System({ system_ast: depends_ast })._depends;

  //     h.expect(systems._all_systems[0].name).to.have.equal('node-example');
  //     h.expect(depends_count).to.have.length(1);
  //   })();
  // });

  // var system001 = new System({ name: 'system001' });
  // systems.addSystem(system001);
  // systems.removeSystem(system001);
  // system001 = systems.find('system001');
  // system001.depends('system002');
  // azkParser.saveSystemsToAzkfile(systems, './Azkfile.js');

});
