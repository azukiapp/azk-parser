import { _ } from 'azk-core';
import System  from './system';

var Parser = require('../../parser');
var parser = new Parser();

var bb = require('bluebird');
bb.longStackTraces();
Error.stackTraceLimit = 25;
// var spawn = bb.coroutine;

/**
 * Code SystemsList
 */
class SystemsList {
  constructor(props) {
    var default_props = {
      systems: []
    };

    this._props = {};
    _.assign(this._props, default_props);
    _.assign(this._props, props);

    this._all_systems = [];

    if (this._props.original_ast) {
      this._original_ast = this._props.original_ast;
      this._parseOriginalAzkFile();
    }
  }

  _parseOriginalAzkFile() {
    // get systems's array
    var systems_array_ast = this._original_ast.program.body[0].expression.arguments[0].properties;
    systems_array_ast.forEach(function (system_ast) {
      var system = new System({ original_ast: system_ast });
      this._all_systems.push(system);
    }.bind(this));
  }

  convert_to_ast() {
    this._ast = this._original_ast;
    if (this._all_systems.length > 0) {
      var systems_ast = this._ast.program.body[0].expression.arguments[0];
      systems_ast.properties = [];

      _.forEach(this._all_systems, function(system) {
        systems_ast.properties.push(system.convert_to_ast());
      });
    }

    return this._ast;
  }

  _parseAzkFile(azkfile_content) {
    // Azkfile.js input to create _systems array
    this._azkfile_input_ast = parser.parse(azkfile_content).syntax;
    var ast_object_expression = this._azkfile_input_ast.program.body[0].expression.arguments[0];
    var all_systems_properties = ast_object_expression.properties;

    all_systems_properties.forEach(function (system_ast) {
      //FIXME: create a system with sys_prop
      var system = new System({ system_ast: system_ast });
      this._all_systems.push(system);
    }.bind(this));
  }

  addSystem(system) {
    this._all_systems.push(system);
  }

  findByName(system_name) {
    return _.find(this._all_systems, function(sys) {
      return sys.name === system_name;
    });
  }

  remove(system) {
    _.remove(this._all_systems, function(sys) {
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

module.exports = SystemsList;
