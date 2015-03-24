import h        from '../../spec-helper';
import System   from '../../../src/azk-parser/syntaxes/system';

import Generator from '../../../src/generator';
var generator = new Generator();

describe('System:', function() {
  var system001;
  beforeEach(function () {
    system001 = new System({ name: 'system001' });
  });

  it('should import a JSON object to system', function () {
    // add two dependencies
    var system001_json = {
      "name": "system001",
      "depends": [
        "system002",
        "system003"
      ],
      "image": {"docker": "azukiapp/azktcl:0.0.1"}
    };

    // create a system from JSON
    var system_from_json = new System({ json: system001_json });

    // get JSON from this new system
    var json = system_from_json.toJSON();
    h.expect(json).not.be.undefined;

    // name
    h.expect(json.name).to.equal('system001');

    // depends
    h.expect(json.depends).to.have.length(2);
    h.expect(json.depends[0]).to.equal('system002');
    h.expect(json.depends[1]).to.equal('system003');

    // image
    h.expect(json.image).to.deep.equal({"docker": "azukiapp/azktcl:0.0.1"});
  });

  it('should system have a syntax', function () {
    h.expect(system001)       .to.not.be.undefined;
    h.expect(system001.syntax).to.not.be.undefined;
  });

  it('should system add a depends', function () {
    system001.addDepends('system002');
    h.expect(system001._depends).to.not.be.undefined;
    h.expect(system001._depends.length).to.eql(1);
  });

  it('should system remove a depends', function () {
    system001.addDepends('system002');
    h.expect(system001._depends.length).to.eql(1);

    system001.rmDepends('system002');
    h.expect(system001._depends.length).to.eql(0);

  });

  it('should generate a system', function () {
    var code = generator.generate(system001.syntax).code;
    h.expect(code).to.eql(
      [
        "system001: {}",
      ].join('\n')
    );
  });

  it('should generate a system with dependencies', function () {
    system001.addDepends('system002');

    var code = generator.generate(system001.syntax).code;
    h.expect(code).to.eql(
      [
        "system001: {",
        "  depends: [\"system002\"]",
        "}",
      ].join('\n')
    );
  });

  it('should generate a system with a image', function () {
    system001 = new System({
      name: 'system001',
      image: {'docker': 'azukiapp/azktcl:0.0.1'}
    });
    var code = generator.generate(system001.syntax).code;
    h.expect(code).to.eql(
      [
        'system001: {',
        '  image: { docker: "azukiapp/azktcl:0.0.1" }',
        '}',
      ].join('\n')
    );
  });

  it('should generate a system with a shell', function () {
    system001 = new System({
      name: 'system001',
      shell: '/bin/bash'
    });
    var code = generator.generate(system001.syntax).code;
    h.expect(code).to.eql(
      [
        'system001: {',
        '  shell: "/bin/bash"',
        '}',
      ].join('\n')
    );
  });

  it('should generate a system with command', function() {
    system001 = new System({
      name: 'system001',
      command: 'npm install'
    });
    var code = generator.generate(system001.syntax).code;
    h.expect(code).to.eql(
      [
        'system001: {',
        '  command: "npm install"',
        '}',
      ].join('\n')
    );
  });

  it('should generate a system with extends', function() {
    system001 = new System({
      name: 'system001',
      extends: 'app'
    });
    var code = generator.generate(system001.syntax).code;
    h.expect(code).to.eql(
      [
        'system001: {',
        '  extends: "app"',
        '}',
      ].join('\n')
    );
  });

  it('should generate a system with workdir', function() {
    system001 = new System({
      name: 'system001',
      workdir: '/azk/#{manifest.dir}'
    });
    var code = generator.generate(system001.syntax).code;
    h.expect(code).to.eql(
      [
        'system001: {',
        '  workdir: "/azk/#{manifest.dir}"',
        '}',
      ].join('\n')
    );
  });

  //FIXME: split this test for each property
  it('should generate a system from an Azkfile.js', function () {
    var azkfile_system_content = [
      'var azkfile_system = { system001: {',
      '  // http://images.azk.io',
      '  image: { docker: "azukiapp/azktcl:0.0.1" },',
      '  envs: { ENV1: "MY GREAT ENV 1", ',
      '          ENV2: "MY WONDERFUL ENV 2" },',
      '  export_envs: { ENV1: "MY SAD ENV 1", ',
      '                 ENV2: "MY POOR ENV 2" },',
      '  ports: {',
      '    http: "9200",',
      '    data: "5432/tcp",',
      '  },',
      '  wait: {retry: 40, timeout: 10000},',
      '  scalable: {',
      '    default: 1,',
      '    limit: 2,',
      '  },',
      '  mounts: { ',
      '    "/azk/#{manifest.dir}/feedbin": path("./feedbin"),',
      '    "/azk/bundler": persistent("bundler"),',
      '    bundler_literal: "bundler_literal_value",',
      '  },',
      '  http: { domains: [ "#{system.name}.#{azk.default_domain}" ]},',
      '',
      '  // depends on systems below',
      '  depends: [\"system002\"],',
      '',
      '  // default shell binary',
      '  shell: "/bin/bash",',
      '  command: "npm start",',
      '  extends: "app",',
      '  workdir: "/azk/#{manifest.dir}",',
      '  dns_servers: ["8.8.8.8", "4.4.4.4"],',
      '  provision: ["npm install"],',
      '} }',
    ].join('\n');

    var system = new System({ azkfile_system: azkfile_system_content });

    h.expect(system._name).to.equal('system001');

    // depends
    h.expect(system._depends).to.have.length(1);
    h.expect(system._depends[0]).to.equal('system002');

    // provision
    h.expect(system._provision).to.have.length(1);
    h.expect(system._provision[0]).to.equal('npm install');

    // dns_servers
    h.expect(system._dns_servers).to.have.length(2);
    h.expect(system._dns_servers[0]).to.equal('8.8.8.8');
    h.expect(system._dns_servers[1]).to.equal('4.4.4.4');

    // image
    h.expect(system._image).to.deep.equal({"docker": "azukiapp/azktcl:0.0.1"});

    // envs
    h.expect(system._envs).to.deep.equal({
      ENV1: "MY GREAT ENV 1",
      ENV2: "MY WONDERFUL ENV 2"
    });

    // export_envs
    h.expect(system._export_envs).to.deep.equal({
      ENV1: "MY SAD ENV 1",
      ENV2: "MY POOR ENV 2"
    });

    // ports
    h.expect(system._ports).to.deep.equal({
      http: "9200",
      data: "5432/tcp",
    });

    // mounts
    h.expect(system._mounts).to.deep.equal({
      "/azk/#{manifest.dir}/feedbin" : 'path("./feedbin")',
      "/azk/bundler"                 : 'persistent("bundler")',
      bundler_literal                : "bundler_literal_value",
    });

    // scalable
    h.expect(system._scalable).to.deep.equal({
      default: 1,
      limit: 2,
    });

    // wait
    h.expect(system._wait).to.deep.equal({
      retry: 40,
      timeout: 10000,
    });

    // shell
    h.expect(system._shell).to.deep.equal({"shell": "/bin/bash"});

    // command
    h.expect(system._command).to.deep.equal({"command": "npm start"});

    // extends
    h.expect(system._extends).to.deep.equal({"extends": "app"});

    // workdir
    h.expect(system._workdir).to.deep.equal({"workdir": "/azk/#{manifest.dir}"});

    // image
    h.expect(system._http.domains).to.have.length(1);
    h.expect(system._http.domains[0]).to.equal('#{system.name}.#{azk.default_domain}');
  });

});
