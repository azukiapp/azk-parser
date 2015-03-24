import h         from '../../spec-helper';
import Systems   from '../../../src/azk-parser/syntaxes/systems';
import System    from '../../../src/azk-parser/syntaxes/system';
import Generator from '../../../src/generator';

var generator = new Generator();

describe('Systems:', function() {
  var systems;
  beforeEach(function () {
    systems = new Systems();
  });

  it('should systems have a syntax', function () {
    h.expect(systems).to.not.been.undefined;
    h.expect(systems._systems).to.have.length(0);
  });

  it('should add a system', function () {
    systems.add( new System({ name: 'system001' }) );
    systems.add( new System({ name: 'system002' }) );

    h.expect(systems._systems).to.have.length(2);
  });

  it('should find a system by name', function () {
    var system_to_include = new System({ name: 'system001' });
    systems.add( system_to_include );

    var system_found = systems.findByName( 'system001' );
    h.expect(system_found).to.eql(system_to_include);
  });

  it('should remove a system', function () {
    var system_to_include = new System({ name: 'system001' });
    systems.add( system_to_include );

    systems.remove( system_to_include );
    h.expect(systems._systems).to.have.length(0);
  });

  it('should generate systems', function () {
    var code = generator.generate(systems.convert_to_ast).code;

    h.expect(code).to.eql(
      [
        "/**",
        " * Documentation: http://docs.azk.io/Azkfile.js",
        " */",
        "",
        "// Adds the systems that shape your system",
        "systems({",
        "",
        "});",
      ].join('\n')
    );

  });

  it('should generate child systems', function () {

    systems.add( new System({ name: 'system001' }) );
    systems.add( new System({ name: 'system002' }) );
    systems.add( new System({ name: 'system003' }) );

    var new_syntax = systems.convert_to_ast;
    var code = generator.generate(new_syntax).code;

    h.expect(code).to.eql(
      [
        "/**",
        " * Documentation: http://docs.azk.io/Azkfile.js",
        " */",
        "",
        "// Adds the systems that shape your system",
        "systems({",
        " system001: {},",
        " system002: {},",
        " system003: {}",
        "});",
      ].join('\n')
    );

  });

  it('should generate child systems from an Azkfile.js', function () {

    var azkfile = [
      "/**",
      " * Documentation: http://docs.azk.io/Azkfile.js",
      " */",
      "",
      "// Adds the systems that shape your system",
      "systems({",
      " system001: {},",
      " system002: {},",
      " system003: {}",
      "});",
    ].join('\n');

    systems = new Systems({ azkfile_content: azkfile });

    h.expect(systems._systems).to.have.length(3);
  });

});
