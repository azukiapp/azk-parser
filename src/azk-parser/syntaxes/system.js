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
  }

  addDependency(system) {
    this._depends.push(system);
  }

  get syntax() {
    // get initial syntax
    var ast = this._initial_syntax();
    var system_body = ast.program.body[0].body.body;

    // set system name
    ast.program.body[0].label.name = this._props.name;

    if (this._depends.length > 0) {
      // 'depends': array property
      var depends_property_array = new PropertyArray({ property_array_name: 'depends'});
      // add each dependency
      this._depends.forEach(function(sys) {
        var depends_item = new Depends({ system: sys });
        depends_property_array.addItem(depends_item.syntax);
      });
      system_body.push(depends_property_array.syntax);
    }

    return ast;
  }

  _initial_syntax() {
    return parser.parse([
        " __SYSTEM_NAME__: {}",
      ]
      .join('\n'))
      .syntax;
  }

  get name() {
    return this._name;
  }

}

module.exports = System;
