import { _ } from 'azk-core';
var recast = require('recast');

/**
 * Code Generator
 */
class Generator {
  constructor(options) {
    var default_options = {
      comment: true,
      format: {
        indent: {
          style: '  ',
          base: 0,
          adjustMultilineComment: false
        },
        newline: '\n',
        space: ' ',
        json: false,
        renumber: false,
        hexadecimal: false,
        quotes: 'single',
        escapeless: false,
        compact: false,
        parentheses: true,
        semicolons: true,
        safeConcatenation: false,
        preserveBlankLines: true
      }
    };

    this._options = {};
    _.assign(this._options, default_options);
    _.assign(this._options, options);
  }

  generate(ast) {
    var code = null;
    code = recast.print(ast).code;
    return code;
  }

  generatePrettyPrint(ast) {
    //var code = recast.prettyPrint(ast, { tabWidth: 2 }).code;
    var code = recast.print(ast).code;
    return code;
  }
}

module.exports = Generator;
