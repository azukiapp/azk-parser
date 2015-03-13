var azk_core    = require('./lib/src/azk-core');
var spec_helper = require('./lib/spec/spec_helper');

module.exports = {
  __esModule: true,
  get h() { return spec_helper; },
  get version() { return azk_core.version; },
  get Q() { return azk_core.Q; },
  get _() { return azk_core._; },
  get lazy_require() { return azk_core.lazy_require; },
  get t() { return azk_core.t; },
  get config() { return azk_core.config; },
  get set_config() { return azk_core.set_config; },
  get defer() { return azk_core.defer; },
  get async() { return azk_core.async; },
  get os() { return azk_core.os; },
  get path() { return azk_core.path; },
  get fs() { return azk_core.fs; },
  get isBlank() { return azk_core.isBlank; },
  get log() { return azk_core.log; },
};
