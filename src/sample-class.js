import { _ } from 'azk-core';

/**
 * azk-projects-boilerplate ES6 class example
 */
class SampleClass {

  /**
   * create a SampleClass receiving an initial list
   * @param  {Array} initial_list  initial list
   * @return {object}              Sample Class instance
   */
  constructor(initial_list) {
    this._initial_list = initial_list || [];
  }

  /**
   * get max number from received list and initial list concated
   * @param  {Array}    list    list to concat with this.initial_list
   * @return {Number}           max number
   */
  getMaxNumber(list) {
    list = list || [];

    if (list.length === 0 && this._initial_list.length === 0) {
      return null;
    }

    var concated_list = this._initial_list.concat(list);
    var max = _.max(concated_list);
    return max;
  }

}

module.exports = SampleClass;
