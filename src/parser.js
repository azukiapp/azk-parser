import { _ } from 'azk-core';
var recast = require('recast');

/**
 * Code Parser
 */
class Parser {
  constructor(options) {
    var default_options = {
      range: true,
      tolerant: false
    };

    this._options = {};
    _.assign(this._options, default_options);
    _.assign(this._options, options);

    this._original_code = null;
    this._ast = null;
  }

  parse(code) {
    if ( !code ) {
      throw new Error('parse( --must receive code-- ) ');
    }

    this._original_code = code;
    this._ast = recast.parse(this._original_code, this._options);

    return this;
  }

  get original_code() {
    return this._original_code;
  }

  get syntax() {
    return this._ast;
  }

}

module.exports = Parser;
