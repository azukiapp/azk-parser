#!/usr/bin/env node

/*
  parse-javascript
*/

require('babel/polyfill');
require('source-map-support').install();

var dlog = require('azk-core').dlog;
var Parser = require('../lib/src/parser');
var fileUtils = require('../lib/src/file-utils');
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
var spaces = parsed.spaces || 2;
var files = parsed.argv.remain;
var first_file = files[0];

fileUtils.readFile(first_file).then(function(file_content) {
  var syntax = parser.parse(file_content);
  var syntax_parsed = JSON.stringify(syntax, ' ', spaces);
  console.log(syntax_parsed);
});
