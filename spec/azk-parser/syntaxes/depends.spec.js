import h        from '../../spec-helper';
import Depends   from '../../../src/azk-parser/syntaxes/depends';
import System   from '../../../src/azk-parser/syntaxes/system';

import Generator from '../../../src/generator';
var generator = new Generator();

describe('Depends:', function() {
  var literal_ast;
  beforeEach(function () {
    literal_ast = new Depends({ system: new System({ name: 'system001' }) });
  });

  it('should depends have a syntax', function () {
    h.expect(literal_ast)       .to.not.be.undefined;
    h.expect(literal_ast.syntax).to.not.be.undefined;
  });

  it('should generate depends', function () {
    var code = generator.generate(literal_ast.syntax).code;
    h.expect(code).to.eql(
      [
        "\"system001\"",
      ].join('\n')
    );
  });

});
