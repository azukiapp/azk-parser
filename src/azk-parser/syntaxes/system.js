import { _ } from 'azk-core';

/**
 * System
 */
class System {
  constructor(options) {
    var default_options = {
      name: '',
    };

    this._options = {};
    _.assign(this._options, default_options);
    _.assign(this._options, options);
  }

  get syntax() {
    return {
      "range": [
        0,
        20
      ],
      "loc": {
        "start": {
          "line": 1,
          "column": 0
        },
        "end": {
          "line": 2,
          "column": 1
        }
      },
      "type": "Program",
      "body": [
        {
          "range": [
            0,
            20
          ],
          "loc": {
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 2,
              "column": 1
            }
          },
          "type": "LabeledStatement",
          "label": {
            "range": [
              0,
              15
            ],
            "loc": {
              "start": {
                "line": 1,
                "column": 0
              },
              "end": {
                "line": 1,
                "column": 15
              }
            },
            "type": "Identifier",
            "name": this._options.name
          },
          "body": {
            "range": [
              17,
              20
            ],
            "loc": {
              "start": {
                "line": 1,
                "column": 17
              },
              "end": {
                "line": 2,
                "column": 1
              }
            },
            "type": "BlockStatement",
            "body": []
          }
        }
      ],
      "comments": [],
      "tokens": [
        {
          "type": "Identifier",
          "value": this._options.name,
          "range": [
            0,
            15
          ],
          "loc": {
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 1,
              "column": 15
            }
          }
        },
        {
          "type": "Punctuator",
          "value": ":",
          "range": [
            15,
            16
          ],
          "loc": {
            "start": {
              "line": 1,
              "column": 15
            },
            "end": {
              "line": 1,
              "column": 16
            }
          }
        },
        {
          "type": "Punctuator",
          "value": "{",
          "range": [
            17,
            18
          ],
          "loc": {
            "start": {
              "line": 1,
              "column": 17
            },
            "end": {
              "line": 1,
              "column": 18
            }
          }
        },
        {
          "type": "Punctuator",
          "value": "}",
          "range": [
            19,
            20
          ],
          "loc": {
            "start": {
              "line": 2,
              "column": 0
            },
            "end": {
              "line": 2,
              "column": 1
            }
          }
        }
      ]
    };

  }
}

module.exports = System;
