import { _ } from 'azk-core';
var Parser = require('../../parser');
var parser = new Parser();

/**
 * Depends
 */
class Depends {
  constructor(props) {
    var default_props = {
      name: '',
    };

    this._props = {};
    _.assign(this._props, default_props);
    _.assign(this._props, props);

    this._system = this._props.system;
  }

  _initial_syntax() {
    return parser.parse([
        '["__DEPENDS_NAME__"]',
      ]
      .join('\n'))
      .syntax;
  }

  get syntax() {
    // get initial syntax
    var ast = this._initial_syntax();

    // set system name
    var body = ast.program.body[0];
    var element = body.expression.elements[0];
    element.value = this._system.name;
    element.raw   = this._system.name;

    return element;
  }

}

module.exports = Depends;
