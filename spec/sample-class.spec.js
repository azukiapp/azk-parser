import h from './spec-helper';
import SampleClass from '../src/sample-class';

/**
 * azk-projects-boilerplate spec example
 * uses mocha and chai
 */
describe("SampleClass", function() {

  var sampleClass;

  beforeEach(function () {
    sampleClass = new SampleClass([1, 2, 3, 4]);
  });

  it("should getMaxNumber() get max number from initial_list", function() {
    var result = sampleClass.getMaxNumber();
    h.expect(result).to.equal(4);
  });

  it("should getMaxNumber() get max number from new list", function() {
    var result = sampleClass.getMaxNumber([-1, -2, 7, 0]);
    h.expect(result).to.equal(7);
  });

  it("should getMaxNumber() get max number from two concated lists, initial_list wins", function() {
    sampleClass = new SampleClass([1, 2, 3, 4]);
    var result = sampleClass.getMaxNumber([-4, -3, -2, -1]);
    h.expect(result).to.equal(4);
  });

  it("should getMaxNumber() get max number from two concated lists, new list wins", function() {
    sampleClass = new SampleClass([1, 2, 3, 4]);
    var result = sampleClass.getMaxNumber([-4, -3, -2, -1, 5]);
    h.expect(result).to.equal(5);
  });

  it("should getMaxNumber() get null when there are no lists", function() {
    sampleClass = new SampleClass();
    var result = sampleClass.getMaxNumber();
    h.expect(result).to.equal(null);
  });

});
