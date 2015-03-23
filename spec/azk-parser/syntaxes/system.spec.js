import h        from '../../spec-helper';
import System   from '../../../src/azk-parser/syntaxes/system';

import Generator from '../../../src/generator';
var generator = new Generator();

// var bb = require('bluebird');
// var spawn = bb.coroutine;

describe('System:', function() {
  var system001;
  beforeEach(function () {
    system001 = new System({ name: 'system001' });
  });

  it('should system have a syntax', function () {
    h.expect(system001)       .to.not.be.undefined;
    h.expect(system001.syntax).to.not.be.undefined;
  });

  it('should system add dependencies', function () {
    var system002 = new System({ name: 'system002' });
    system001.addDependency(system002);

    h.expect(system001._depends).to.not.be.undefined;
    h.expect(system001._depends.length).to.eql(1);
  });

  it('should generate a system', function () {
    var code = generator.generate(system001.syntax);
    h.expect(code).to.eql(
      [
        "system001: {}",
      ].join('\n')
    );
  });

  it('should generate a system with dependencies', function () {
    var system002 = new System({ name: 'system002' });
    system001.addDependency(system002);

    var code = generator.generate(system001.syntax);
    h.expect(code).to.eql(
      [
        "system001: {",
        "  depends: [\"system002\"]",
        "}",
      ].join('\n')
    );
  });

});
