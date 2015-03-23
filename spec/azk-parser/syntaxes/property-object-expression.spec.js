import h                          from '../../spec-helper';
import PropertyObjectExpression   from '../../../src/azk-parser/syntaxes/property-object-expression';
import Generator                  from '../../../src/generator';
var generator = new Generator();

describe('PropertyObjectExpression:', function() {
  var property_obj_exp_ast;
  beforeEach(function () {
    property_obj_exp_ast = new PropertyObjectExpression({
      key:   'KEY',
      value: 'VALUE',
    });
  });

  it('should depends have a syntax', function () {
    h.expect(property_obj_exp_ast)       .to.not.be.undefined;
    h.expect(property_obj_exp_ast.syntax).to.not.be.undefined;
  });

  it('should generate code', function () {
    var code = generator.generate(property_obj_exp_ast.syntax).code;
    h.expect(code).to.eql(
      [
        "\"KEY\": \"VALUE\"",
      ].join('\n')
    );
  });

});
