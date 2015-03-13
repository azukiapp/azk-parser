var azk_core    = require('./lib/src/azk-core');
var config      = require('./lib/src/config');
var i18n        = require('./lib/src/i18n');
var utils       = require('./lib/src/utils');
var spec_helper = require('./lib/spec/spec_helper');

module.exports = {
	azk_core    : azk_core,
	spec_helper : spec_helper,
	config      : config,
	i18n        : i18n,
	utils       : utils,

	// fast access to utils functions
	_           : azk_core._,
	h           : spec_helper,
};
