import h from './spec-helper';
import Parser from '../src/parser';

describe('Parser:', function() {

  var parser;

  beforeEach(function () {
    parser = new Parser();
  });

  it('should parse `40 + 2;`', function() {
    var syntax = parser.parse('40 + 2;').syntax;

    // body[0]
    var body = syntax.program.body[0];
    var expression = body.expression;
    h.expect(body).to.have.property('type', 'ExpressionStatement');
    h.expect(expression).to.have.deep.property('type', 'BinaryExpression');
    h.expect(expression).to.have.deep.property('operator', '+');
    h.expect(expression).to.have.deep.property('left.type', 'Literal');
    h.expect(expression).to.have.deep.property('left.value', 40);
    h.expect(expression).to.have.deep.property('right.type', 'Literal');
    h.expect(expression).to.have.deep.property('right.value', 2);
    h.expect(body).to.have.property('type', 'ExpressionStatement');
  });

});
