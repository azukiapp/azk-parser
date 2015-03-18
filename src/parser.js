import { log, _ } from 'azk-core';
var esprima = require('esprima');

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
  }

  parse(code) {
    var syntax = esprima.parse(code, this._options);

    log.debug('\n\n:: parser.parse() - syntax::');
    log.debug(syntax);

    return syntax;
  }
}

module.exports = Parser;
