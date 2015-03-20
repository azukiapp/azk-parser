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
        2,
        24
      ],
      "loc": {
        "start": {
          "line": 1,
          "column": 2
        },
        "end": {
          "line": 2,
          "column": 3
        }
      },
      "type": "Program",
      "body": [
        {
          "range": [
            2,
            24
          ],
          "loc": {
            "start": {
              "line": 1,
              "column": 2
            },
            "end": {
              "line": 2,
              "column": 3
            }
          },
          "type": "LabeledStatement",
          "label": {
            "range": [
              2,
              17
            ],
            "loc": {
              "start": {
                "line": 1,
                "column": 2
              },
              "end": {
                "line": 1,
                "column": 17
              }
            },
            "type": "Identifier",
            "name": this._options.name
          },
          "body": {
            "range": [
              19,
              24
            ],
            "loc": {
              "start": {
                "line": 1,
                "column": 19
              },
              "end": {
                "line": 2,
                "column": 3
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
            2,
            17
          ],
          "loc": {
            "start": {
              "line": 1,
              "column": 2
            },
            "end": {
              "line": 1,
              "column": 17
            }
          }
        },
        {
          "type": "Punctuator",
          "value": ":",
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
          "value": "{",
          "range": [
            19,
            20
          ],
          "loc": {
            "start": {
              "line": 1,
              "column": 19
            },
            "end": {
              "line": 1,
              "column": 20
            }
          }
        },
        {
          "type": "Punctuator",
          "value": "}",
          "range": [
            23,
            24
          ],
          "loc": {
            "start": {
              "line": 2,
              "column": 2
            },
            "end": {
              "line": 2,
              "column": 3
            }
          }
        }
      ]
    };

  }
}

module.exports = System;
