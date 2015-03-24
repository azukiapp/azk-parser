import AzkParser from '../../src/azk-parser';

describe('AzkParser:', function() {
  var azkParser;
  before(function () {
    azkParser = new AzkParser();
  });

  it('should parse an Azkfile.js', function () {
    var systems = azkParser.getSystemsFromAzkfile('./Azkfile.js');
    var system001 = new System({ name: 'system001' });
    systems.addSystem(system001);
    systems.removeSystem();

    var system001 = systems.find('system001');
    system001.depends('system002');

    azkParser.saveSystemsToAzkfile(systems, './Azkfile.js');
  });

});
