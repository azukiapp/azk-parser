import { _ } from 'azk-core';
var Parser = require('../../parser');
var parser = new Parser();

/**
 * PropertyObjectExpression
 */
class PropertyObjectExpression {
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

    // alias
    this._property = this._ast.program.body[0].declarations[0].init.properties[0];
  }

  _initialize_syntax() {
    this._ast = parser.parse([
        'var obj = { __PROPERTY_KEY__: "__PROPERTY_VALUE__" }',
      ]
      .join('\n'))
      .syntax;
  }

  addElement(literal) {
    this._property.value.elements.push(literal);
  }

  get syntax() {

    var isValidFunctionName = function() {
      var validName = /^[$A-Z_][0-9A-Z_$]*$/i;
      var reserved = {
        'abstract':true,
        'boolean':true,
        // ...
        'with':true
      };
      return function(s) {
        // Ensure a valid name and not reserved.
        return validName.test(s) && !reserved[s];
      };
    }();

    // key
    if (!isValidFunctionName(this._key)) {
      this._property.key.type = 'Literal';
      this._property.key.value = this._key;
      this._property.key.raw   = this._key;
    } else {
      this._property.key.name = this._key;
    }

    // value
    this._property.value.value = this._value;
    this._property.value.raw   = this._value;

    return this._property;
  }

}

module.exports = PropertyObjectExpression;
