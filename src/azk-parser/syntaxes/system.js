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
    this._command = this._props.command || null;
    this._extends = this._props.extends || null;
    this._workdir = this._props.workdir || null;

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

    var system_ast = this._ast.program.body[0]
      .declarations[0].init.properties[0];

    var system_properties_ast = system_ast.value.properties;

    this._name = system_ast.key.name;

    system_properties_ast.forEach(function (prop) {
      //FIXME: turn into generic functions for similar parameters
      if (prop.key.name === "depends") {
        prop.value.elements.forEach(function (depend_system) {
          this.addDepends(depend_system.value);
        }.bind(this));
      } else if (prop.key.name === "image") {
        var image_name = prop.value.properties[0].key.name;
        this._image = {};
        this._image[image_name] = prop.value.properties[0].value.value;
      } else {
        var shell_name = 'shell';
        this._shell = {};
        this._shell[shell_name] = prop.value.value;
      }
    }.bind(this));

    return this;
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

    // set system shell
    if (this._shell) {
      this._property.value.properties.push(this.getLiteralPropertySyntax('shell', '/bin/bash'));
    }

    // set system command
    if (this._command) {
      this._property.value.properties.push(this.getLiteralPropertySyntax('command', 'npm install'));
    }

    // set system extends
    if (this._extends) {
      this._property.value.properties.push(this.getLiteralPropertySyntax('extends', 'app'));
    }

    // set system workdir
    if (this._workdir) {
      this._property.value.properties.push(this.getLiteralPropertySyntax('workdir', '/azk/#{manifest.dir}'));
    }

    return this._property;
  }

  getLiteralPropertySyntax(property_name, property_value) {
    var literal_property = new PropertyObjectExpression({
      key: property_name,
      value: property_value
    });

    return literal_property.syntax;
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
