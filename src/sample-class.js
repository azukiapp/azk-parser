import { _ } from 'azk-core';

class SampleClass {
  constructor() { }
  sampleMethod() {
    var max = _.max([1, 2, 3, 4]);
    return max;
  }
}

module.exports = SampleClass;
