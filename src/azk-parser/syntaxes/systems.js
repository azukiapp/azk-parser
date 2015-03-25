import { _ } from 'azk-core';
import System  from './system';

var Parser = require('../../parser');
var parser = new Parser();

var bb = require('bluebird');
bb.longStackTraces();
Error.stackTraceLimit = 25;
// var spawn = bb.coroutine;

/**
 * Code Systems
 */
class Systems {
  constructor(props) {
    var default_props = {
      systems: []
    };

    this._props = {};
    _.assign(this._props, default_props);
    _.assign(this._props, props);

    this._systems = [];

    if (this._props.azkfile_content) {
      this._initialize_syntax();
      this._parseAzkFile(this._props.azkfile_content);
    } else if (this._props.azkfile_content_to_update) {
      this._parseAzkfileToUpdate(this._props.azkfile_content_to_update);
    } else {
      this._initialize_syntax();
    }
  }

  _initialize_syntax() {
    this._ast = parser.parse([
        "/**",
        " * Documentation: http://docs.azk.io/Azkfile.js",
        " */",
        "",
        "// Adds the systems that shape your system",
        "systems({",
        "",
        "});",
      ]
      .join('\n'))
      .syntax;
  }

  _parseAzkfileToUpdate(azkfile_content_to_update) {
    this._ast = parser.parse(azkfile_content_to_update).syntax;
    var ast_object_expression = this._ast.program.body[0].expression.arguments[0];
    var all_systems_properties = ast_object_expression.properties;

    all_systems_properties.forEach(function (system_ast) {
      var system = new System({ system_ast_to_update: system_ast });
      this._systems.push(system);
    }.bind(this));
  }

  _parseAzkFile(azkfile_content) {
    // Azkfile.js input to create _systems array
    this._azkfile_input_ast = parser.parse(azkfile_content).syntax;
    var ast_object_expression = this._azkfile_input_ast.program.body[0].expression.arguments[0];
    var all_systems_properties = ast_object_expression.properties;

    all_systems_properties.forEach(function (system_ast) {
      //FIXME: create a system with sys_prop
      var system = new System({ system_ast: system_ast });
      this._systems.push(system);
    }.bind(this));
  }

  get convert_to_ast() {
    if (this._systems.length > 0) {
      // get ObjectExpression in systems({})
      var ast_object_expression = this._ast.program.body[0].expression.arguments[0];

      _.forEach(this._systems, function(system) {
        ast_object_expression.properties.shift();
        ast_object_expression.properties.push(system.convert_to_ast);
      });
    }

    return this._ast;
  }

  add(system) {
    this._systems.push(system);
  }

  findByName(system_name) {
    return _.find(this._systems, function(sys) {
      return sys.name === system_name;
    });
  }

  remove(system) {
    _.remove(this._systems, function(sys) {
      return system.name === sys.name;
    });
  }

  _findSystemsObject(/*syntax*/) {
    var node_selected = null;
    // estraverse.traverse(syntax, {
    //   enter: function(node) {
    //     if (node.type === 'ObjectExpression') {
    //       node_selected = node;
    //     }
    //   }
    // });
    return node_selected;
  }

}

module.exports = Systems;
