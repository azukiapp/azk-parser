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
    systems.add( new System({ name: 'system001' }) );
    systems.add( new System({ name: 'system002' }) );
    systems.add( new System({ name: 'system003' }) );
    var new_syntax = systems._createSyntax();
    var code = generator.generate(new_syntax);
    h.expect(code).to.eql(`/**
 * Documentation: http://docs.azk.io/Azkfile.js
 */
// Adds the systems that shape your system
systems({
    system001: {
  },
    system002: {
  },
    system003: {
  }
});`);
  });

});
