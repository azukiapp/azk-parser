import { _ } from 'azk-core';
var Parser = require('../../parser');
var parser = new Parser();

/**
 * Literal
 */
class Literal {
  constructor(props) {
    var default_props = {
      name: '',
    };

    this._props = {};
    _.assign(this._props, default_props);
    _.assign(this._props, props);

    this._value = this._props.value;

    this._initialize_syntax();
  }

  _initialize_syntax() {
    this._ast = parser.parse([
        '["__DEPENDS_NAME__"]',
      ]
      .join('\n'))
      .syntax;
  }

  convert_to_ast() {
    // set system name
    var body = this._ast.program.body[0];
    var element = body.expression.elements[0];
    element.value = this._value;
    element.raw   = this._value;

    return element;
  }

}

module.exports = Literal;
