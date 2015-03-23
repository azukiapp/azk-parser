import { _ } from 'azk-core';
var recast = require('recast');

/**
 * Code Generator
 */
class Generator {
  constructor(options) {
    var default_options = {
      tabWidth: 2,
      isPreetyPrint: false
    };

    this._options = {};
    _.assign(this._options, default_options);
    _.assign(this._options, options);

    this._original_ast = null;
    this._generated_code = null;
  }

  generate(ast) {
    var code = null;
    if (this._options.isPreetyPrint) {
      code = recast.prettyPrint(ast, { tabWidth: this._options.tabWidth || 2 }).code;
    } else {
      code = recast.print(ast).code;
    }

    this._original_ast = ast;
    this._generated_code = code;

    return this;
  }

  get original_syntax() {
    return this._original_ast;
  }

  get code() {
    return this._generated_code;
  }
}

module.exports = Generator;
