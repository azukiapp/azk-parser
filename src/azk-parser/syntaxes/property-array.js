import { _ } from 'azk-core';
var Parser = require('../../parser');
var parser = new Parser();

/**
 * PropertyArray
 */
class PropertyArray {
  constructor(props) {
    var default_props = {
      name: '',
    };

    this._props = {};
    _.assign(this._props, default_props);
    _.assign(this._props, props);

    this._ast = null;
    this._property_key_name = this._props.property_array_name;

    this._initialize_syntax();

    // alias
    this._property = this._ast.program.body[0].declarations[0].init.properties[0];
  }

  _initialize_syntax() {
    this._ast = parser.parse([
        'var obj = { __PROPERTY_ARRAY_NAME__: [] }',
      ]
      .join('\n'))
      .syntax;
  }

  addElement(literal) {
    this._property.value.elements.push(literal);
  }

  get syntax() {
    this._property.key.name = this._property_key_name;
    return this._property;
  }

}

module.exports = PropertyArray;
