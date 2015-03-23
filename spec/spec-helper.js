var chai  = require('chai');

// Chai extensions
chai.use(require('chai-as-promised'));
chai.use(require('chai-things'));

// stack included appears to be not useful
// if you are lost, you can try to disable source-maps on gulpfile
chai.config.includeStack = false;

var Helpers = {
  expect : chai.expect,
};

export default Helpers;
