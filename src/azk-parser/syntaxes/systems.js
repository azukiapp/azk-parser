import { _ } from 'azk-core';
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
    };

    this._props = {};
    _.assign(this._props, default_props);
    _.assign(this._props, props);

    this._systems = [];

    this._initialize_syntax();
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

  get syntax() {
    if (this._systems.length > 0) {

      // get ObjectExpression in system({})
      var ast_object_expression = this._ast.program.body[0].expression.arguments[0];

      _.forEach(this._systems, function(system) {
        ast_object_expression.properties.push(system.syntax);
      });
    }

    return this._ast;
  }

}

module.exports = Systems;
