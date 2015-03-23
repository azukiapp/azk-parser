import { _ } from 'azk-core';
import Depends from './depends';
import PropertyArray from './property-array';

var Parser = require('../../parser');
var parser = new Parser();

/**
 * System
 */
class System {
  constructor(props) {
    var default_props = {
    };

    this._props = {};
    _.assign(this._props, default_props);
    _.assign(this._props, props);

    this._name    = this._props.name;
    this._depends = this._props.depends || [];

    this._initialize_syntax();
  }

  addDependency(system) {
    this._depends.push(system);
  }

  get syntax() {
    // get initial syntax
    this._property = this._syntax.program.body[0].declarations[0].init.properties[0];

    // set system name
    this._property.key.name = this._props.name;

    if (this._depends.length > 0) {
      // 'depends': array property
      var depends_property_array = new PropertyArray({ property_array_name: 'depends'});
      // add each dependency
      this._depends.forEach(function(sys) {
        var depends_item = new Depends({ system: sys });
        depends_property_array.addItem(depends_item.syntax);
      });
      this._property.value.properties.push(depends_property_array.syntax);
    }

    return this._property;
  }

  _initialize_syntax() {
    this._syntax = parser.parse([
        "var obj = { __SYSTEM_NAME__: {} }",
      ]
      .join('\n'))
      .syntax;
  }

  get name() {
    return this._name;
  }

}

module.exports = System;
