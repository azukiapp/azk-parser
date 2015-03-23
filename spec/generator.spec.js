import h from './spec-helper';
import Generator from '../src/generator';

describe('Generator:', function() {

  var generator;

  beforeEach(function () {
    generator = new Generator();
  });

  it('should generate `40 + 2;`', function() {
    var ast = (
      { type: 'Program',
        body:
         [ { type: 'ExpressionStatement',
             expression:
              { type: 'BinaryExpression',
                operator: '+',
                left: { type: 'Literal', value: 40, raw: '40' },
                right: { type: 'Literal', value: 2, raw: '2' } } } ] }
    );

    var generated_code = generator.generate(ast)
    .code;

    h.expect(generated_code).to.equal('40 + 2;');
  });

});
