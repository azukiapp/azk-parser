#!/usr/bin/env node

/*
  parse-javascript
*/

var _ = require('lodash');
var dlog = require('azk-core').dlog;
var Parser = require('../lib/src/parser');
var parser = new Parser();

// https://www.npmjs.com/package/nopt
var nopt     = require('nopt');

var knownOpts  =  {
                    'spaces'   : Number,
                    'help'          : Boolean,
                    'verbose'       : Boolean,
                  };

var shortHands =  {
                    '?' : ['--help'],
                    's' : ['--spaces'],
                    'h' : ['--help'],
                    'v' : ['--verbose'],
                  };

var parsed     = nopt(knownOpts, shortHands, process.argv, 2);
var is_verbose = parsed.verbose || false;

if (parsed.help || parsed.argv.original.length === 0) {
  var usage_message = ['',
    ' Usage:',
    '',
    '   $ parse-javascript [input_javascript_file]',
    '',
    ' Options:',
    '',
    '   --spaces, -s       identation spacecount (default: 2)',
    '   --verbose, -v      show more info on output',
    '   --help, -h, -?     show this help message',
    '',
    ' Examples: (all lines below will return 5)',
    '',
    '   $ ./bin/parse-javascript.js ./bin/parse-javascript.js',
    ''].join('\n');
  console.log(usage_message);
  process.exit(0);
}

is_verbose && dlog(parsed, 'parsed nopt args', null);
var files = parsed.argv.remain;
var spaces = parsed.spaces || 2;
var first_file = files[0];

var syntax = parser.parse('1 + 1;');
var syntax_parsed = JSON.stringify(syntax, ' ', spaces);
console.log(syntax_parsed);
