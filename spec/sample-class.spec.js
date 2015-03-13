import h from 'azk-core';
import SampleClass from '../src/sample-class';

describe("azk-projects-boilerplate", function() {
  it("sample class", function() {
    var sampleClass = new SampleClass();
    var result = sampleClass.sampleMethod();
    h.expect(result).to.equal(4);
  });
});
