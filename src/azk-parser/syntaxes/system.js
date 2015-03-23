import { _ }                    from 'azk-core';
import Literal                  from './literal';
import PropertyArray            from './property-array';
import PropertyObjectExpression from './property-object-expression';
import PropertyObjectExpressionObjectValue
  from './property-object-expression-object-value';

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
    this._image   = this._props.image   || null;
    this._shell   = this._props.shell   || null;

    this._initialize_syntax();

    if (this._props.azkfile_system) {
      this._parseAzkFileSystem(this._props.azkfile_system);
    } else {
      this._initialize_syntax();
    }

    if (this._props.json) {
      this.fromJSON(this._props.json);
    }
  }

  _parseAzkFileSystem(azkfile_system) {
    var parser = new Parser({ tolerant: true });
    this._ast = parser.parse(azkfile_system).syntax;

    var system_properties = this._ast.program.body[0]
      .declarations[0].init.properties[0].value.properties;

    system_properties.forEach(function (prop) {
      /**/require('azk-core').dlog(prop.key.name, "prop.key.name", null);/*-debug-*/
    });

    // var all_systems_properties = ast_object_expression.properties;
    //
    // all_systems_properties.forEach(function (sys_prop) {
    //   //FIXME: create a system with sys_prop
    //   //var system = new System({ azkfile_system: sys_prop });
    //   this._systems.push(sys_prop.name);
    // }.bind(this));

  }

  _initialize_syntax() {
    this._ast = parser.parse([
        "var obj = { __SYSTEM_NAME__: {} }",
      ]
      .join('\n'))
      .syntax;
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
    this._initialize_syntax();

    // get initial syntax
    this._property = this._ast.program.body[0].declarations[0].init.properties[0];

    // set system name
    this._property.key.name = this._name;

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

    // image
    if (this._image) {

      var image_property_obj_exp = new PropertyObjectExpressionObjectValue({
        key: 'image'
      });

      var image_repository = new PropertyObjectExpression({
        key: 'docker',
        value: 'azukiapp/azktcl:0.0.1'
      });
      image_property_obj_exp.addPropertyObjectExpression(image_repository.syntax);

      this._property.value.properties.push(image_property_obj_exp.syntax);
    }

    // set system name
    if (this._shell) {
      var shell_property = new PropertyObjectExpression({
        key: 'shell',
        value: '/bin/bash'
      });

      this._property.value.properties.push(shell_property.syntax);
    }

    return this._property;
  }

  get name() {
    return this._name;
  }

  toJSON() {
    var json = {};
    json.name = this._name;

    json.depends = _.map(this._depends, function(sys_name) {
      return sys_name;
    }, this);

    json.image = this._image;

    return json;
  }

  fromJSON(json) {
    // name
    if (json.name) {
      this._name = json.name;
    }

    // depends
    if (json.depends && json.depends.length > 0) {
      // initialize depends
      this._depends = [];
      // add each dependent system name
      _.forEach(json.depends, function(depends_item) {
        this.addDepends(depends_item);
      }, this);
    }

    // image
    if (json.image) {
      this._image = json.image;
    }
  }

}

module.exports = System;
