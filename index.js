var azk_core    = require('./lib/src/azk-core');
var config      = require('./lib/src/config');
var i18n        = require('./lib/src/i18n');
var utils       = require('./lib/src/utils');
var spec_helper = require('./lib/spec/spec_helper');

module.exports = {
  __esModule: true,
  // get azk_core    : azk_core,
  // spec_helper : spec_helper,
  get config      () { return config; },
  get i18n        () { return i18n; },
  get utils       () { return utils; },

  // fast access to utils functions
  get _           () { return azk_core._; },
  get h           () { return spec_helper; },
};
