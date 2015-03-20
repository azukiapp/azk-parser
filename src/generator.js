import { log, _ } from 'azk-core';
var escodegen = require('escodegen');

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

  generate(syntax) {
    syntax = escodegen.attachComments(syntax, syntax.comments, syntax.tokens);
    var code = escodegen.generate(syntax, this._options);

    log.debug('\n\n:: generator.generate() - code::');
    log.debug(code);

    return code;
  }
}

module.exports = Generator;
