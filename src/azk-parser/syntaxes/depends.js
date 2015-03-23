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

    this._initialize_syntax();
  }

  _initialize_syntax() {
    this._ast = parser.parse([
        '["__DEPENDS_NAME__"]',
      ]
      .join('\n'))
      .syntax;
  }

  get syntax() {
    // set system name
    var body = this._ast.program.body[0];
    var element = body.expression.elements[0];
    element.value = this._system.name;
    element.raw   = this._system.name;

    return element;
  }

}

module.exports = Depends;
