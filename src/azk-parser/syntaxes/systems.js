import { _ } from 'azk-core';
var estraverse = require('estraverse');
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

  _findSystemsObject(syntax) {
    var node_selected = null;
    estraverse.traverse(syntax, {
      enter: function(node) {
        if (node.type === 'ObjectExpression') {
          node_selected = node;
        }
      }
    });
    return node_selected;
  }

  get syntax() {
    // get initial syntax
    var final_syntax = this._initial_syntax();

    if (this._systems.length > 0) {
      // find ObjectExpression system({})
      var object_expression = this._findSystemsObject(final_syntax);

      _.forEach(this._systems, function(system) {
        object_expression.properties.push(system.syntax);
      });
    }

    return final_syntax;
  }

  _initial_syntax() {
    return parser.parse([
      "/**",
      " * Documentation: http://docs.azk.io/Azkfile.js",
      " */",
      "",
      "// Adds the systems that shape your system",
      "systems({",
      "",
      "});",
    ].join('\n'));
  }
}

module.exports = Systems;
