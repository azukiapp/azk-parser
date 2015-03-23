import h                          from '../../spec-helper';
import PropertyObjectExpression   from '../../../src/azk-parser/syntaxes/property-object-expression';
import PropertyObjectExpressionObjectValue
                                  from '../../../src/azk-parser/syntaxes/property-object-expression-object-value';
import Generator                  from '../../../src/generator';
var generator = new Generator();

describe('PropertyObjectExpressionObjectValue:', function() {
  var property_obj_exp_obj_value;
  beforeEach(function () {
    property_obj_exp_obj_value = new PropertyObjectExpressionObjectValue({
      key: 'KEY'
    });
  });

  it('should depends have a syntax', function () {
    h.expect(property_obj_exp_obj_value)       .to.not.be.undefined;
    h.expect(property_obj_exp_obj_value.syntax).to.not.be.undefined;
  });

  it('should generate code a KEY', function () {
    var prop_exp = new PropertyObjectExpression({
      key:   'INNER_KEY',
      value: 'INNER_VALUE',
    });
    property_obj_exp_obj_value.addPropertyObjectExpression(prop_exp.syntax);

    var code = generator.generate(property_obj_exp_obj_value.syntax).code;
    h.expect(code).to.eql(
      [
        "KEY: { \"INNER_KEY\": \"INNER_VALUE\" }",
      ].join('\n')
    );
  });

  it('should generate code a KEY-LITERAL', function () {
    property_obj_exp_obj_value = new PropertyObjectExpressionObjectValue({
      key: 'KEY-LITERAL'
    });

    var prop_exp = new PropertyObjectExpression({
      key:   'INNER_KEY',
      value: 'INNER_VALUE',
    });
    property_obj_exp_obj_value.addPropertyObjectExpression(prop_exp.syntax);

    var code = generator.generate(property_obj_exp_obj_value.syntax).code;
    h.expect(code).to.eql(
      [
        "\"KEY-LITERAL\": { \"INNER_KEY\": \"INNER_VALUE\" }",
      ].join('\n')
    );
  });

});
