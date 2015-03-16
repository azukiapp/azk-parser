#!/usr/bin/env node

var _ = require('azk-core')._;
var SampleClass = require('../lib/src/sample-class');
var util = require('util');
var inspect = function (data) {
  console.log('   ' + util.inspect(data, { showHidden:false, colors:true }));
};

// https://www.npmjs.com/package/nopt
var nopt     = require('nopt');

var knownOpts  =  {
                    'number' : [Number, Array]
                  };

var shortHands =  {
                    'n' : ['--number'],
                  };

             // everything is optional.
             // knownOpts and shorthands default to {}
             // arg list defaults to process.argv
             // slice defaults to 2
var parsed     = nopt(knownOpts, shortHands, process.argv, 2);

var remain_numbers;
var all_numbers;
var sampleClass = new SampleClass();
var result;

console.log('\n parsed nopt args:');
inspect(parsed);

// remain: convert strings to numbers
if (_.isArray(parsed.argv.remain)) {
  remain_numbers = _.map(parsed.argv.remain, function(item) {
    return Number(item);
  });
}

if (_.isArray(parsed.numbers) && _.isArray(remain_numbers)) {
  all_numbers = parsed.numbers.concat(remain_numbers);
} else if (_.isArray(parsed.numbers)) {
  all_numbers = parsed.numbers;
} else if (_.isArray(remain_numbers)) {
  all_numbers = remain_numbers;
}

result = sampleClass.getMaxNumber(all_numbers);

console.log('\n all_numbers:');
inspect(all_numbers);

console.log('\n sampleClass.getMaxNumber(all_numbers):');
inspect(result);
