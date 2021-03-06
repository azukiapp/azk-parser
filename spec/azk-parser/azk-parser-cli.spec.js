import h            from '../spec-helper';
import AzkParserCli from '../../src/azk-parser/azk-parser-cli';
var bb = require('bluebird');
var spawn = bb.coroutine;

describe('AzkParserCli:', function() {
  var azkParserCli;

  azkParserCli = new AzkParserCli();

  it('should instantiate AzkParserCli', function () {
    h.expect(azkParserCli).to.not.be.undefined;
  });

  it('should get systems from an Azkfile.js', function () {
    return spawn(function* () {
      var node_azkfile_path = './fixtures/azkfile-examples/node-example-Azkfile.js';
      yield azkParserCli.load(node_azkfile_path);
      h.expect(azkParserCli._systems_list._all_systems).to.have.length(1);
    })();
  });

  it('should list all systems name from an Azkfile.js', function () {
    return spawn(function* () {
      var node_azkfile_path = './fixtures/azkfile-examples/node-example-Azkfile.js';
      yield azkParserCli.load(node_azkfile_path);
      var systems_string_list = azkParserCli.listAllSystems();
      h.expect(systems_string_list).to.be.deep.equal(['node-example']);
    })();
  });

  it('should search for a system by name', function () {
    return spawn(function* () {
      var node_azkfile_path = './fixtures/azkfile-examples/node-example-Azkfile.js';
      yield azkParserCli.load(node_azkfile_path);

      var node_system = azkParserCli.getSystemByName('node-example');
      h.expect(node_system.name).to.be.equal('node-example');
    })();
  });

  it('should add a systems-list to another systems-list', function () {
    return spawn(function* () {
      var node_azkfile_path = './fixtures/azkfile-examples/node-example-Azkfile.js';
      var ngrok_azkfile_path = './fixtures/azkfile-examples/ngrok-example-Azkfile.js';

      yield azkParserCli.load(node_azkfile_path);
      yield azkParserCli.addSystems(ngrok_azkfile_path);

      h.expect(azkParserCli._systems_list._all_systems).to.have.length(2);
    })();
  });

  it('should save an Azkfile from a systems-list', function () {
    return spawn(function* () {
      var node_azkfile_path = './fixtures/azkfile-examples/node-example-Azkfile.js';
      var ngrok_azkfile_path = './fixtures/azkfile-examples/ngrok-example-Azkfile.js';

      /*
      azk add mysql
      >> add ./current-Azkfile.js /sample/mysql-azkfile.js
      << save azkfile
      */

      yield azkParserCli.load(node_azkfile_path);
      yield azkParserCli.addSystems(ngrok_azkfile_path);
      var result_azkfile = yield azkParserCli.save('/tmp/azkfile-from-test.js');

      h.expect(result_azkfile.indexOf('ngrok')).to.not.be.equal(-1);
    })();
  });

  it('should add', function () {
    return spawn(function* () {
      var node_azkfile_path = './fixtures/azkfile-examples/node-example-Azkfile.js';
      var ngrok_azkfile_path = './fixtures/azkfile-examples/ngrok-example-Azkfile.js';

      // saving azkfile
      yield azkParserCli.load(node_azkfile_path);
      yield azkParserCli.save('/tmp/azkfile-from-test.js');

      var tmp_azkfile = yield azkParserCli.add('/tmp/azkfile-from-test.js', ngrok_azkfile_path);

      h.expect(tmp_azkfile.indexOf('ngrok')).to.not.be.equal(-1);
    })();
  });

  //   Who depends on system?
  //     - node
  //     - rails
  //     - python
  // <- ['node', 'python']
  // find node
  // add dependency

});
