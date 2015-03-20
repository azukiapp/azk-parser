import h         from '../../spec-helper';
import Systems   from '../../../src/azk-parser/syntaxes/systems';
import System    from '../../../src/azk-parser/syntaxes/system';
import Generator from '../../../src/generator';
// var bb = require('bluebird');
// var spawn = bb.coroutine;

var generator = new Generator();

describe('Systems', function() {
  var systems;
  beforeEach(function () {
    systems = new Systems();
  });

  it('should systems have a syntax', function () {
    h.expect(systems).to.not.been.undefined;
    h.expect(systems._systems).to.have.length(0);
  });

  it('should systems have a syntax', function () {
    systems.add( new System({ name: 'system001' }) );
    systems.add( new System({ name: 'system002' }) );

    h.expect(systems._systems).to.have.length(2);
  });

  it('should generate systems', function () {
    var code = generator.generate(systems.syntax);
    h.expect(code).to.eql(`/**
 * Documentation: http://docs.azk.io/Azkfile.js
 */
// Adds the systems that shape your system
systems({});`);
  });

  it('should generate systems', function () {
    var code = generator.generate(systems.syntax);
    h.expect(code).to.eql(`/**
 * Documentation: http://docs.azk.io/Azkfile.js
 */
// Adds the systems that shape your system
systems({});`);
  });

  it('should get all nodes', function () {
    var nodes = systems._findSystemsObject();
    /**/require('azk-core').dlog(nodes, "nodes", null);/*-debug-*/
    h.expect(nodes).to.not.be.undefined;
  });

//   it('should systems with systems', function () {
//     systems.add( new System({ name: 'system001' }) );
//     systems.add( new System({ name: 'system002' }) );
//     var code = generator.generate(systems.syntax);
//     h.expect(code).to.eql(`/**
//  * Documentation: http://docs.azk.io/Azkfile.js
//  */
// // Adds the systems that shape your system
// systems({
//   system001: {},
//   system002: {}
// });`);
//   });

});
