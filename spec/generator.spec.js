import h from './spec-helper';
import Generator from '../src/generator';

describe("Generator", function() {

  var generator;

  beforeEach(function () {
    generator = new Generator();
  });

  it("should generate `40 + 2;`", function() {
    var generated_code = generator.generate({ range: [ 0, 7 ],
      loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 7 } },
      type: 'Program',
      body:
       [ { range: [ 0, 7 ],
           loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 7 } },
           type: 'ExpressionStatement',
           expression:
            { range: [ 0, 6 ],
              loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 6 } },
              type: 'BinaryExpression',
              operator: '+',
              left:
               { range: [ 0, 2 ],
                 loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 2 } },
                 type: 'Literal',
                 value: 40,
                 raw: '40' },
              right:
               { range: [ 5, 6 ],
                 loc: { start: { line: 1, column: 5 }, end: { line: 1, column: 6 } },
                 type: 'Literal',
                 value: 2,
                 raw: '2' } } } ],
      comments: [],
      tokens:
       [ { type: 'Numeric',
           value: '40',
           range: [ 0, 2 ],
           loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 2 } } },
         { type: 'Punctuator',
           value: '+',
           range: [ 3, 4 ],
           loc: { start: { line: 1, column: 3 }, end: { line: 1, column: 4 } } },
         { type: 'Numeric',
           value: '2',
           range: [ 5, 6 ],
           loc: { start: { line: 1, column: 5 }, end: { line: 1, column: 6 } } },
         { type: 'Punctuator',
           value: ';',
           range: [ 6, 7 ],
           loc: { start: { line: 1, column: 6 }, end: { line: 1, column: 7 } } } ]
    });

    h.expect(generated_code).to.equal('40 + 2;');
  });

});
