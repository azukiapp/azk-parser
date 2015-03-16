#!/usr/bin/env node

/*
  azk-projects-boilerplate bin example
  With that file we can install with -g
  or execute at command line with ./bin/getMax.js
 */

var _ = require('lodash');
var SampleClass = require('../lib/src/sample-class');
var sampleClass = new SampleClass();

// https://www.npmjs.com/package/nopt
var nopt     = require('nopt');

var knownOpts  =  {
                    'number' : [Number, Array],
                    'help'   : Boolean,
                    'verbose'   : Boolean,
                  };

var shortHands =  {
                    'n' : ['--number'],
                    '?' : ['--help'],
                    'h' : ['--help'],
                    'v' : ['--verbose'],
                  };

             // everything is optional.
             // knownOpts and shorthands default to {}
             // arg list defaults to process.argv
             // slice defaults to 2
var parsed     = nopt(knownOpts, shortHands, process.argv, 2);

if (parsed.help || parsed.argv.original.length === 0) {
  var usage_message = ['',
    ' Usage:',
    '',
    '   $ getMax [options]',
    '',
    ' Options:',
    '',
    '   --number, -n     include a number to find max',
    '   --verbose, -v    show more info on output',
    '   --help, -h, -?   show this help message',
    '',
    ' Examples: (all lines below will return 5)',
    '',
    '   $ getMax -n 1 -n 2 -n 3 -n 4 -n 5',
    '   $ getMax --number 1 --number 2 --number 3 --number 4 --number 5',
    '   $ getMax 1 2 3 4 5',
    '   $ getMax 1 -n 2 3 --number 4 5',
    ''].join('\n');
  console.log(usage_message);
  return;
}

var remain_numbers;
var all_numbers;

var result;
var is_verbose = parsed.verbose || false;

// verbose
var util = require('util');
var inspect = function (data) {
  console.log('   ' + util.inspect(data, { showHidden:false, colors:true }));
};

is_verbose && console.log('\n parsed nopt args:');
is_verbose && inspect(parsed);

// remain: convert strings to numbers
if (_.isArray(parsed.argv.remain)) {
  remain_numbers = _.map(parsed.argv.remain, function(item) {
    return Number(item);
  });
}

if (_.isArray(parsed.number) && _.isArray(remain_numbers)) {
  all_numbers = parsed.number.concat(remain_numbers);
} else if (_.isArray(parsed.number)) {
  all_numbers = parsed.number;
} else if (_.isArray(remain_numbers)) {
  all_numbers = remain_numbers;
}

result = sampleClass.getMaxNumber(all_numbers);

is_verbose && console.log('\n all_numbers:');
is_verbose && inspect(all_numbers);

is_verbose && console.log('\n sampleClass.getMaxNumber(all_numbers) -->');
console.log(result);
