#!/usr/bin/env node

/*
  azk-parser
*/

require('babel/polyfill');
require('source-map-support').install();

var dlog = require('azk-core').dlog;
var AzkParser = require('../lib/src/azk-parser');
var fileUtils = require('../lib/src/file-utils');
var azkParser = new AzkParser();

// https://www.npmjs.com/package/nopt
var nopt     = require('nopt');

var knownOpts  =  {
                    'input'         : String,
                    'output'        : String,
                    'add'           : String,
                    'help'          : Boolean,
                    'verbose'       : Boolean,
                  };

var shortHands =  {
                    '?' : ['--help'],
                    's' : ['--spaces'],
                    'i' : ['--input'],
                    'o' : ['--output'],
                    'a' : ['--add'],
                    'h' : ['--help'],
                    'v' : ['--verbose'],
                  };

var parsed     = nopt(knownOpts, shortHands, process.argv, 2);
var is_verbose = parsed.verbose || false;

if (parsed.help || parsed.argv.original.length === 0) {
  var usage_message = ['',
    ' Usage:',
    '',
    '   $ azk-parser [input_file|URL] [options]',
    '',
    ' Options:',
    '',
    '   --input, -i              filepath/url to input Azkfile.js filename (default: null)',
    '   --output, -o             filepath to output Azkfile.js filename (default: null)',
    '   --add, -a                filepath to Azkfile.js to add to input Azkfile.js (default: null)',
    '   --depends [sys1] [sys2]  change dependency. sys1 will depend on sys2 (default: null)',
    '   --verbose, -v            show more info on output',
    '   --help, -h, -?           show this help message',
    '',
    ' Examples:',
    '',
    '   $ ./bin/azk-parser -i ./fixtures/azkfile-examples/node-example-Azkfile.js -o /tmp/output.js',
    ''].join('\n');
  console.log(usage_message);
  process.exit(0);
}

is_verbose && dlog(parsed, 'parsed nopt args', null);
var output = parsed.output || null;
// var add = parsed.add || null;
var remains_args = parsed.argv.remain;

// get input Azkfile.js
var input = parsed.input || null;
if (remains_args.length > 0 && !input) {
  input = remains_args[0];
}

if (!output) {
  output = input;
}

azkParser.getSystemsFromAzkfile(input).then(function(systems) {

  var all_input_systems = systems._systems;
  all_input_systems.forEach(function(sys) {
    console.log('> \`' + sys.name + '\`' + ' system detected');
  });

  // generate code
  azkParser.saveSystemsToAzkfile(systems, output).then(function() {
    fileUtils.read(output).then(function(output_content) {
      console.log('> Azkfile generated at:', output);
      console.log('');
      console.log(output_content.toString());
      console.log('');
    });
  });

});
