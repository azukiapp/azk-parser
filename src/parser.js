import { _ } from 'azk-core';
var recast = require('recast');

/**
 * Code Parser
 */
class Parser {
  constructor(options) {
    var default_options = {
      raw: true,
      tokens: true,
      range: true,
      comment: true,
      loc: true
    };

    this._options = {};
    _.assign(this._options, default_options);
    _.assign(this._options, options);

    this._code = null;
    this._syntax = null;
  }

  parse(code) {
    if ( !code ) {
      throw new Error('parse( --must receive code-- ) ');
    }

    this._code = code;
    this._syntax = recast.parse(this._code, this._options);

    return this;
  }

  get syntax() {
    return this._syntax;
  }

  get code() {
    return this._code;
  }

}

module.exports = Parser;
