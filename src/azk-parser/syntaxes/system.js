import { _ }                    from 'azk-core';
import Literal                  from './literal';
import PropertyArray            from './property-array';
import PropertyObjectExpression from './property-object-expression';
import PropertyObjectExpressionObjectValue
  from './property-object-expression-object-value';

var Parser    = require('../../parser');
var parser    = new Parser();
var Generator = require('../../generator');
var generator = new Generator();

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

    this._initialize_syntax();

    if (this._props.system_ast) {                           //AST
      this._parseSystemAST(this._props.system_ast);
    } else if (this._props.azkfile_system) {                //content
      this._parseAzkFileSystem(this._props.azkfile_system);
    } else if (this._props.json) {                          //json
      this.fromJSON(this._props.json);
    }
  }

  _parseAzkFileSystem(azkfile_system_string_content) {
    var parser = new Parser({ tolerant: true });
    var ast = parser.parse(azkfile_system_string_content).syntax;
    return this._parseSystemAST(ast);
  }

  _parseSystemAST(ast) {
    this._input_ast = ast;

    this.cleanAllProperties();

    var system_properties_ast = this._input_ast.value.properties;

    this._name = this._input_ast.key.name || this._input_ast.key.value;

    system_properties_ast.forEach(function (prop) {
      //FIXME: turn into generic functions for similar parameters
      if (prop.key.name === 'depends') {
        prop.value.elements.forEach(function (depend_system) {
          this.addDepends(depend_system.value);
        }.bind(this));
      } else if (prop.key.name === 'provision') {
        prop.value.elements.forEach(function (provision_step) {
          this._provision.push(provision_step.value);
        }.bind(this));
      } else if (prop.key.name === 'dns_servers') {
        prop.value.elements.forEach(function (dns_server) {
          this._dns_servers.push(dns_server.value);
        }.bind(this));
      } else if (prop.key.name === 'image') {
        var image_name = prop.value.properties[0].key.name ||
                          prop.value.properties[0].key.value;
        this._image[image_name] = prop.value.properties[0].value.value;
      } else if (prop.key.name === 'envs') {
        this._setSystemMultiProperties (this._envs, prop);
      } else if (prop.key.name === 'export_envs') {
        this._setSystemMultiProperties (this._export_envs, prop);
      } else if (prop.key.name === 'ports') {
        this._setSystemMultiProperties (this._ports, prop);
      } else if (prop.key.name === 'scalable') {
        this._setSystemMultiProperties (this._scalable, prop);
      } else if (prop.key.name === 'wait') {
        this._setSystemMultiProperties (this._wait, prop);
      } else if (prop.key.name === 'mounts') {
        var property_array = prop.value.properties;
        property_array.forEach(function (prop_array_item) {
          // FIXME: new mount structure
          // mounts: {
          //   'key': {
          //     'name': path || persistent
          //     'type': string || function
          //     'path': '\.'
          // }
          // get key; FIXME: extract to helper function
          var system_property_key = null;
          if (prop_array_item.key.type === 'Literal') {
            system_property_key = prop_array_item.key.value;
          } else if (prop_array_item.key.type === 'Identifier') {
            system_property_key = prop_array_item.key.name;
          }

          var item_value = null;
          if (prop_array_item.value.type === 'CallExpression') {
            item_value = generator.generate(prop_array_item.value).code;
          } else {
            item_value = prop_array_item.value.value;
          }

          this._mounts[system_property_key] = item_value;

        }.bind(this));
      } else if (prop.key.name === 'http') {
        var domains_key = prop.value.properties[0].key.name;
        this._http[domains_key] = [];
        var domains_array = prop.value.properties[0].value.elements;
        domains_array.forEach(function (domain_item) {
          this._http[domains_key].push(domain_item.value);
        }.bind(this));
      } else if (prop.key.name === 'shell') {
        this._shell = prop.value.value;
      } else if (prop.key.name === 'command') {
        this._command = prop.value.value;
      } else if (prop.key.name === 'extends') {
        this._extends = prop.value.value;
      } else if (prop.key.name === 'workdir') {
        this._workdir = prop.value.value;
      }
    }.bind(this));

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

  _setSystemMultiProperties (system_property, ast_property) {
    var property_array = ast_property.value.properties;
    property_array.forEach(function (prop_array_item) {
      system_property[prop_array_item.key.name] = prop_array_item.value.value;
    });
  }

  _initialize_syntax() {
    this._ast = parser.parse([
        "var obj = { __SYSTEM_NAME__: {} }",
      ]
      .join('\n'))
      .syntax
      .program.body[0].declarations[0].init.properties[0];
  }

  addDepends(system_name) {
    this._depends.push(system_name);
  }

  rmDepends(system_name) {
    _.remove(this._depends, function(sys_name) {
      return sys_name === system_name;
    }, this);
  }

  get convert_to_ast() {
    // get initial syntax
    this._property = this._ast;

    // set system name
    if (this._name.indexOf('-') > 0 ) { //FIXME: analyse all special characters
      this._property.key.type = 'Literal';
      this._property.key.value = this._name;
      this._property.key.raw   = this._name;
    } else {
      this._property.key.name   = this._name;
    }

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

    // http
    if (this._http) {
      var http_property_obj_exp = new PropertyObjectExpressionObjectValue({
        key: 'http'
      });

      if (this._http.domains && this._http.domains.length > 0) {
        var http_domains_property_array = new PropertyArray({ property_array_name: 'domains'});
        // add each domain
        this._http.domains.forEach(function(domain_url) {
          var literal = new Literal({ value: domain_url });
          http_domains_property_array.addElement(literal.syntax);
        });
        http_property_obj_exp.addPropertyObjectExpression(http_domains_property_array.syntax);
      }

      this._property.value.properties.push(http_property_obj_exp.syntax);
    }

    // image
    if (this._image) {
      var image_property_obj_exp = new PropertyObjectExpressionObjectValue({
        key: 'image'
      });

      var key = Object.keys(this._image)[0];
      var image_repository = new PropertyObjectExpression({
        key: key,
        value: this._image[key]
      });
      image_property_obj_exp.addPropertyObjectExpression(image_repository.syntax);

      this._property.value.properties.push(image_property_obj_exp.syntax);
    }

    // set system shell
    if (this._shell) {
      this._property.value.properties.push(this.getLiteralPropertySyntax('shell', this._shell));
    }

    // set system command
    if (this._command) {
      this._property.value.properties.push(this.getLiteralPropertySyntax('command', this._command));
    }

    // set system extends
    if (this._extends) {
      this._property.value.properties.push(this.getLiteralPropertySyntax('extends', this._extends));
    }

    // set system workdir
    if (this._workdir) {
      this._property.value.properties.push(this.getLiteralPropertySyntax('workdir', this._workdir));
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
