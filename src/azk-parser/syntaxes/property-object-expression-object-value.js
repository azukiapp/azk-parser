import { _ } from 'azk-core';
var Parser = require('../../parser');
var parser = new Parser();

/**
 * PropertyObjectExpressionObjectValue
 */
class PropertyObjectExpressionObjectValue {
  constructor(props) {
    var default_props = {
      key: '',
      value: '',
    };

    this._props = {};
    _.assign(this._props, default_props);
    _.assign(this._props, props);

    this._key   = this._props.key;
    this._value = this._props.value;

    this._ast = null;

    this._initialize_syntax();
  }

  _initialize_syntax() {
    this._ast = parser.parse([
        'var obj = { __PROPERTY_KEY__: { "__INNER_PROPERTY_KEY__": "__INNER_PROPERTY_VALUE__" } }',
      ]
      .join('\n'))
      .syntax;

    // alias
    this._property = this._ast.program.body[0].declarations[0].init.properties[0];

    // clean example property expression
    this._property.value.properties = [];
  }

  addPropertyObjectExpression(prop_exp_ast) {
    this._property.value.properties.push(prop_exp_ast);
  }

  get syntax() {
    // key
    if (this._key.indexOf('-') > 0 ) {
      this._property.key.type = 'Literal';
      this._property.key.value = this._key;
      this._property.key.raw   = this._key;
    } else {
      this._property.key.name   = this._key;
    }

    return this._property;
  }

}

module.exports = PropertyObjectExpressionObjectValue;
