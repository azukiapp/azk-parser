import { _ } from 'azk-core';
import Literal from './literal';
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

    if (this._props.json) {
      this.fromJSON(this._props.json);
    }
  }

  addDepends(system_name) {
    this._depends.push(system_name);
  }

  rmDepends(system_name) {
    _.remove(this._depends, function(sys_name) {
      return sys_name === system_name;
    }, this);
  }

  get syntax() {
    // get initial syntax
    this._property = this._ast.program.body[0].declarations[0].init.properties[0];

    // set system name
    this._property.key.name = this._props.name;

    // depends
    if (this._depends && this._depends.length > 0) {
      var depends_property_array = new PropertyArray({ property_array_name: 'depends'});
      // add each dependency
      this._depends.forEach(function(sys_name) {
        var literal = new Literal({ value: sys_name });
        depends_property_array.addElement(literal.syntax);
      });
      this._property.value.properties.push(depends_property_array.syntax);
    }

    return this._property;
  }

  _initialize_syntax() {
    this._ast = parser.parse([
        "var obj = { __SYSTEM_NAME__: {} }",
      ]
      .join('\n'))
      .syntax;
  }

  get name() {
    return this._name;
  }

  toJSON() {
    var json = {};
    json.depends = _.map(this._depends, function(sys_name) {
      return sys_name;
    }, this);
    return json;
  }

  fromJSON(json) {
    if (json.depends && json.depends.length > 0) {
      // initialize depends
      this._depends = [];
      // add each dependent system name
      _.forEach(json.depends, function(depends_item) {
        this.addDepends(depends_item);
      }, this);
    }
  }

}

module.exports = System;
