import { _ } from 'azk-core';
var estraverse = require('estraverse');

var bb = require('bluebird');
bb.longStackTraces();
Error.stackTraceLimit = 25;
// var spawn = bb.coroutine;

/**
 * Code Systems
 */
class Systems {
  constructor(options) {
    var default_options = {
    };

    this._options = {};
    _.assign(this._options, default_options);
    _.assign(this._options, options);

    this._systems = [];

  }

  add(system) {
    this._systems.push(system);
  }

  _findSystemsObject() {
    var nodes = [];
    estraverse.traverse(this.syntax, {
      enter: function(node) {
        if (node.type === 'ObjectExpression') {
          nodes.push(node);
        }
      }
    });
    return nodes;
  }

  get syntax() {
    return {
      "range": [
        101,
        119
      ],
      "loc": {
        "start": {
          "line": 7,
          "column": 0
        },
        "end": {
          "line": 9,
          "column": 3
        }
      },
      "type": "Program",
      "body": [
        {
          "range": [
            101,
            119
          ],
          "loc": {
            "start": {
              "line": 7,
              "column": 0
            },
            "end": {
              "line": 9,
              "column": 3
            }
          },
          "type": "ExpressionStatement",
          "expression": {
            "range": [
              101,
              118
            ],
            "loc": {
              "start": {
                "line": 7,
                "column": 0
              },
              "end": {
                "line": 9,
                "column": 2
              }
            },
            "type": "CallExpression",
            "callee": {
              "range": [
                101,
                112
              ],
              "loc": {
                "start": {
                  "line": 7,
                  "column": 0
                },
                "end": {
                  "line": 7,
                  "column": 11
                }
              },
              "type": "Identifier",
              "name": "systems"
            },
            "arguments": [
              {
                "range": [
                  113,
                  117
                ],
                "loc": {
                  "start": {
                    "line": 7,
                    "column": 12
                  },
                  "end": {
                    "line": 9,
                    "column": 1
                  }
                },
                "type": "ObjectExpression",
                "properties": []
              }
            ]
          }
        }
      ],
      "comments": [
        {
          "type": "Block",
          "value": "*\n * Documentation: http://docs.azk.io/Azkfile.js\n ",
          "range": [
            1,
            56
          ],
          "loc": {
            "start": {
              "line": 2,
              "column": 0
            },
            "end": {
              "line": 4,
              "column": 3
            }
          }
        },
        {
          "type": "Line",
          "value": " Adds the systems that shape your system",
          "range": [
            58,
            100
          ],
          "loc": {
            "start": {
              "line": 6,
              "column": 0
            },
            "end": {
              "line": 6,
              "column": 42
            }
          }
        }
      ],
      "tokens": [
        {
          "type": "Identifier",
          "value": "systems",
          "range": [
            101,
            112
          ],
          "loc": {
            "start": {
              "line": 7,
              "column": 0
            },
            "end": {
              "line": 7,
              "column": 11
            }
          }
        },
        {
          "type": "Punctuator",
          "value": "(",
          "range": [
            112,
            113
          ],
          "loc": {
            "start": {
              "line": 7,
              "column": 11
            },
            "end": {
              "line": 7,
              "column": 12
            }
          }
        },
        {
          "type": "Punctuator",
          "value": "{",
          "range": [
            113,
            114
          ],
          "loc": {
            "start": {
              "line": 7,
              "column": 12
            },
            "end": {
              "line": 7,
              "column": 13
            }
          }
        },
        {
          "type": "Punctuator",
          "value": "}",
          "range": [
            116,
            117
          ],
          "loc": {
            "start": {
              "line": 9,
              "column": 0
            },
            "end": {
              "line": 9,
              "column": 1
            }
          }
        },
        {
          "type": "Punctuator",
          "value": ")",
          "range": [
            117,
            118
          ],
          "loc": {
            "start": {
              "line": 9,
              "column": 1
            },
            "end": {
              "line": 9,
              "column": 2
            }
          }
        },
        {
          "type": "Punctuator",
          "value": ";",
          "range": [
            118,
            119
          ],
          "loc": {
            "start": {
              "line": 9,
              "column": 2
            },
            "end": {
              "line": 9,
              "column": 3
            }
          }
        }
      ]
    };

  }
}

module.exports = Systems;
