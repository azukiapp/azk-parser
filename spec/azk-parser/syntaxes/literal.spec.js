import h        from '../../spec-helper';
import Literal   from '../../../src/azk-parser/syntaxes/literal';
import Generator from '../../../src/generator';
var generator = new Generator();

describe('Literal:', function() {
  var literal_ast;
  beforeEach(function () {
    literal_ast = new Literal({ value: 'system001' });
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
