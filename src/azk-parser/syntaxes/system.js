import { _ }                    from 'azk-core';
import Literal                  from './literal';
import PropertyArray            from './property-array';
import PropertyObjectExpression from './property-object-expression';
import PropertyObjectExpressionObjectValue
  from './property-object-expression-object-value';

var Parser    = require('../../parser');
var parser    = new Parser();
// var Generator = require('../../generator');
// var generator = new Generator();

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

    this._name        = this._props.name;
    this._depends     = this._props.depends     || [];
    this._provision   = this._props.provision   || [];
    this._dns_servers = this._props.dns_servers || [];
    this._image       = this._props.image       || null;
    this._shell       = this._props.shell       || null;
    this._command     = this._props.command     || null;
    this._extends     = this._props.extends     || null;
    this._workdir     = this._props.workdir     || null;
    this._http        = this._props.http        || null;
    this._envs        = this._props.envs        || null;
    this._export_envs = this._props.export_envs || null;
    this._ports       = this._props.ports       || null;
    this._scalable    = this._props.scalable    || null;
    this._mounts      = this._props.mounts      || null;
    this._wait        = this._props.wait        || null;

    this.ALL_SYSTEM_KEYS = [
      'name',
      'http',
      'workdir',
      'command',
      'export_envs',
      'provision',
      'ports',
      'image',
      'depends',
      'envs',
      'mounts',
      'extends',
      'dns_servers',
      'scalable',
      'shell',
      'wait'];

    // load original Azkfile.js
    if (this._props.original_ast) {
      this._original_ast = this._props.original_ast;
      this._parseOriginalAst();
      return;
    }

    // load from JSON
    if (this._props.original_json) {
      this._original_json = this._props.original_json;
      this.parseJSON();
      return;
    }

    this._initialize_syntax();
    this.cleanAllProperties();
  }

  _parseOriginalAst() {
    this._name = this._getKeyName(this._original_ast.key);
  }

  _getKeyName(key_ast) {
    return key_ast.name || key_ast.value;
  }

  _setKeyName(key_ast, value) {
    if (key_ast.value) {
      key_ast.value = value;
    } else if (key_ast.name) {
      key_ast.name  = value;
    }
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }

  convert_to_ast() {
    if (this._original_ast) {
      this._ast = this._original_ast;
    }

    this._setKeyName(this._ast.key, this._name);

    // depends
    if (this._depends && this._depends.length > 0) {
      var existing_depends = this.findSystemProperty('depends');

      existing_depends.value.elements = _.map(this._depends, function(dependency) {
        var dependency_literal = new Literal({ value: dependency });
        return dependency_literal.convert_to_ast();
      }, this);
    }

    return this._ast;
  }

  findSystemProperty(prop_name) {
    return this._ast.value.properties.find(function(prop) {
      return prop.key.name === prop_name;
    });
  }

  addDependency(system_name) {
    this._depends.push(system_name);
  }

  convert_to_JSON() {
    var json = {};

    var all_system_keys = _.keys(this);

    all_system_keys = _.filter(all_system_keys, function(key) {
      return _.includes(this.ALL_SYSTEM_KEYS, key.substring(1, key.length));
    }, this);

    _.forEach(all_system_keys, function(system_key) {
      var propertyName = system_key.substring(1, system_key.length);
      json[propertyName] = this[system_key];
    }, this);

    return json;
  }

  parseJSON() {
    if (!this._original_json) {
      throw new Error('this._original_json must exist to call parseJSON()');
    }

    var all_json_keys = _.keys(this._original_json);

    _.forEach(all_json_keys, function(n) {
      this['_' + n] = this._original_json[n];
    }, this);
  }

  //
  //
  //
  //
  //
  _parseAzkFileSystem(azkfile_system_string_content) {
    var parser = new Parser({ tolerant: true });
    var ast = parser.parse(azkfile_system_string_content).syntax;
    return this._parseSystemAST(ast);
  }

  _parseSystemAstToUpdate(ast) {
    this._ast = ast;
    this._ast_to_update = ast;
    return this;
  }

  cleanAllProperties() {
    this._depends     = [];
    this._dns_servers = [];
    this._provision   = [];
    this._workdir     = "";
    this._extends     = "";
    this._command     = "";
    this._shell       = "";
    this._image       = {};
    this._http        = {};
    this._envs        = {};
    this._export_envs = {};
    this._ports       = {};
    this._scalable    = {};
    this._mounts      = {};
    this._wait        = {};
  }

  _initialize_syntax() {
    this._ast = parser.parse([
        "var obj = { __SYSTEM_NAME__: {} }",
      ]
      .join('\n'))
      .syntax
      .program.body[0].declarations[0].init.properties[0];
  }

  // _setSystemMultiProperties (system_property, ast_property) {
  //   var property_array = ast_property.value.properties;
  //   property_array.forEach(function (prop_array_item) {
  //     system_property[this.getKeyName(prop_array_item.key)] = prop_array_item.value.value;
  //   }.bind(this));
  // }

  rmDepends(system_name) {
    _.remove(this._depends, function(sys_name) {
      return sys_name === system_name;
    }, this);
  }

  // substituteSystemProperty(property) {
  //   return this._ast_to_update.value.properties.find(function(prop) {
  //     if (prop.key.name === prop_name) {
  //
  //     }
  //   });
  // }

  getLiteralPropertySyntax(property_name, property_value) {
    var literal_property = new PropertyObjectExpression({
      key: property_name,
      value: property_value
    });

    return literal_property.syntax;
  }

  getArrayPropertySyntax(property_name, property_value) {
    var array_property = new PropertyArray({ property_array_name: property_name});
    // add each dependency
    property_value.forEach(function(sys_name) {
      var literal = new Literal({ value: sys_name });
      array_property.addElement(literal.syntax);
    });

    return array_property.syntax;
  }

  getObjectExpressionObjectSyntax(property_name, property_value) {
    var property_obj_exp = new PropertyObjectExpressionObjectValue({
      key: property_name
    });

    var keys = Object.keys(property_value);
    var property_array = _.map(keys, function(key) {
      return new PropertyObjectExpression({
        key: key,
        value: property_value[key]
      });
    }, this);

    property_array.forEach(function(property_ast) {
      property_obj_exp.addPropertyObjectExpression(property_ast.syntax);
    });

    this._property.value.properties.push(property_obj_exp.syntax);
  }
}

module.exports = System;
