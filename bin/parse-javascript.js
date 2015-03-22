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
                    'spaces'        : Number,
                    'output'        : String,
                    'help'          : Boolean,
                    'verbose'       : Boolean,
                  };

var shortHands =  {
                    '?' : ['--help'],
                    's' : ['--spaces'],
                    'o' : ['--output'],
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
    '   --output, -o       output file name (default: null)',
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
var output = parsed.output || null;
var files = parsed.argv.remain;
var first_file = files[0];

fileUtils.read(first_file).then(function(file_content) {

  // parse syntax
  var syntax;
  try {
    syntax = parser.parse(file_content).syntax;
  } catch (err) {
    console.error('\n  >> ERROR ----------------------------');
    console.error('    >> parser.parse(\'' + first_file + '\')');
    console.error('');
    dlog(err, "err", null);
    is_verbose && console.log('\n>>---------\n err.stack:', err.stack, '\n>>---------\n');
    console.error('\n  << ERROR ----------------------------');
    process.exit(1);
  }

  // convert to JSON
  var syntax_parsed = JSON.stringify(syntax, ' ', spaces);

  // output
  if (output) {
    fileUtils.write(output, syntax_parsed);
    console.log(first_file, 'syntax saved at', output);
  } else {
    console.log(syntax_parsed);
  }
});
