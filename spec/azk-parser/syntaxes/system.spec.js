import h        from '../../spec-helper';
import System   from '../../../src/azk-parser/syntaxes/system';
import Parser from '../../../src/parser';
import Generator from '../../../src/generator';

var generator = new Generator();
var parser    = new Parser();

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

  it('should convert system to ast', function () {
    h.expect(system001)       .to.not.be.undefined;
    h.expect(system001.convert_to_ast).to.not.be.undefined;
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

  it('should generate a simple system', function () {
    var code = generator.generate(system001.convert_to_ast).code;
    h.expect(code).to.eql(
      [
        "system001: {}",
      ].join('\n')
    );
  });

  it('should generate a system with dependencies', function () {
    system001.addDepends('system002');

    var code = generator.generate(system001.convert_to_ast).code;
    h.expect(code).to.eql(
      [
        "system001: {",
        "  depends: [\"system002\"]",
        "}",
      ].join('\n')
    );
  });

  it('should generate a system with dns_servers', function () {
    system001 = new System({
      name: 'system001',
      dns_servers: ['8.8.8.8', '4.4.4.4']
    });

    var code = generator.generate(system001.convert_to_ast).code;
    h.expect(code).to.eql(
      [
        "system001: {",
        "  dns_servers: [\"8.8.8.8\", \"4.4.4.4\"]",
        "}",
      ].join('\n')
    );
  });

  it('should generate a system with provision', function () {
    system001 = new System({
      name: 'system001',
      provision: ['npm install']
    });

    var code = generator.generate(system001.convert_to_ast).code;
    h.expect(code).to.eql(
      [
        "system001: {",
        "  provision: [\"npm install\"]",
        "}",
      ].join('\n')
    );
  });

  it('should generate a system with a shell', function () {
    system001 = new System({
      name: 'system001',
      shell: '/bin/bash'
    });
    var code = generator.generate(system001.convert_to_ast).code;
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
    var code = generator.generate(system001.convert_to_ast).code;
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
    var code = generator.generate(system001.convert_to_ast).code;
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
    var code = generator.generate(system001.convert_to_ast).code;
    h.expect(code).to.eql(
      [
        'system001: {',
        '  workdir: "/azk/#{manifest.dir}"',
        '}',
      ].join('\n')
    );
  });

  it('should generate a system with an image', function () {
    system001 = new System({
      name: 'system001',
      image: {'docker': 'azukiapp/azktcl:0.0.1'}
    });
    var code = generator.generate(system001.convert_to_ast).code;
    h.expect(code).to.eql(
      [
        'system001: {',
        '  image: { docker: "azukiapp/azktcl:0.0.1" }',
        '}',
      ].join('\n')
    );
  });

  // envs
  it('should generate a system with envs', function () {
    system001 = new System({
      name: 'system001',
      envs: {'ENV1': 'foo', 'ENV2': 'bar'}
    });
    var code = generator.generate(system001.convert_to_ast).code;
    h.expect(code).to.eql(
      [
        'system001: {',
        '  envs: {',
        '    ENV1: "foo",',
        '    ENV2: "bar"',
        '  }',
        '}',
      ].join('\n')
    );
  });

  // export_envs
  it('should generate a system with export_envs', function () {
    system001 = new System({
      name: 'system001',
      export_envs: {'ENV1': 'foo', 'ENV2': 'bar'}
    });
    var code = generator.generate(system001.convert_to_ast).code;
    h.expect(code).to.eql(
      [
        'system001: {',
        '  export_envs: {',
        '    ENV1: "foo",',
        '    ENV2: "bar"',
        '  }',
        '}',
      ].join('\n')
    );
  });

  // mounts:  { key : value } (value = persisten('') or path('.') //multiple
  it('should generate a system with mounts', function () {
    system001 = new System({
      name: 'system001',
      mounts: {'INTERNAL_FOLDER': "path('LOCAL_PATH')"}
    });
    var code = generator.generate(system001.convert_to_ast).code;
    h.expect(code).to.eql(
      [
        'system001: {',
        '  mounts: { INTERNAL_FOLDER: "path(\'LOCAL_PATH\')" }',
        '}',
      ].join('\n')
    );
  });

  // ports: { key : value } //multiple
  it('should generate a system with ports', function () {
    system001 = new System({
      name: 'system001',
      ports: {'http': '3000'}
    });
    var code = generator.generate(system001.convert_to_ast).code;
    h.expect(code).to.eql(
      [
        'system001: {',
        '  ports: { http: "3000" }',
        '}',
      ].join('\n')
    );
  });

  // scalable: { key : value } ( default: 1, limit:1 }
  it('should generate a system with scalable', function () {
    system001 = new System({
      name: 'system001',
      scalable: {'default': 2}
    });
    var code = generator.generate(system001.convert_to_ast).code;
    h.expect(code).to.eql(
      [
        'system001: {',
        '  scalable: { default: 2 }',
        '}',
      ].join('\n')
    );
  });

  // wait: { key : value } ( retry: [ATTEMPT_NUM], timeout: [TIME_BETWEEN_ATTEMPTS_IN_MILLISECONDS] )
  it('should generate a system with wait', function () {
    system001 = new System({
      name: 'system001',
      wait: {'retry': 20, 'timeout': 1000}
    });
    var code = generator.generate(system001.convert_to_ast).code;
    h.expect(code).to.eql(
      [
        'system001: {',
        '  wait: {',
        '    retry: 20,',
        '    timeout: 1000',
        '  }',
        '}',
      ].join('\n')
    );
  });

  var getSystemFromAST = function (azkfile_system_content) {
    var syntax = parser.parse(azkfile_system_content).syntax;
    var parsed_system = syntax.program.body[0].declarations[0].init.properties[0];
    return parsed_system;
  };

  it('should generate a system from an Azkfile.js with the http parameter', function () {
    var azkfile_system_content = [
      'var azkfile_system = { system001: {',
      '  http: { domains: [ "#{system.name}.#{azk.default_domain}" ]},',
      '} }',
    ].join('\n');

    var system = new System({ system_ast: getSystemFromAST(azkfile_system_content) });

    h.expect(system._name).to.equal('system001');

    // http
    h.expect(system._http.domains).to.have.length(1);
    h.expect(system._http.domains[0]).to.equal('#{system.name}.#{azk.default_domain}');
  });

  it('should generate a system from an Azkfile.js with the image parameter', function () {
    var azkfile_system_content = [
      'var azkfile_system = { system001: {',
      '  // http://images.azk.io',
      '  image: { docker: "azukiapp/azktcl:0.0.1" },',
      '} }',
    ].join('\n');

    var system = new System({ system_ast: getSystemFromAST(azkfile_system_content) });

    h.expect(system._name).to.equal('system001');

    // image
    h.expect(system._image).to.deep.equal({"docker": "azukiapp/azktcl:0.0.1"});
  });

  it('should generate a system from an Azkfile.js with the depends parameter', function () {
    var azkfile_system_content = [
      'var azkfile_system = { system001: {',
      '  // depends on systems below',
      '  depends: [\"system002\"],',
      '} }',
    ].join('\n');

    var system = new System({ system_ast: getSystemFromAST(azkfile_system_content) });

    h.expect(system._name).to.equal('system001');

    // depends
    h.expect(system._depends).to.have.length(1);
    h.expect(system._depends[0]).to.equal('system002');
  });

  it('should generate a system from an Azkfile.js with the mounts parameter', function () {
    var azkfile_system_content = [
      'var azkfile_system = { system001: {',
      '  mounts: { ',
      '    "/azk/#{manifest.dir}/feedbin": path("./feedbin"),',
      '    "/azk/bundler": persistent("bundler"),',
      '    bundler_literal: "bundler_literal_value",',
      '  },',
      '} }',
    ].join('\n');

    var system = new System({ system_ast: getSystemFromAST(azkfile_system_content) });

    h.expect(system._name).to.equal('system001');

    // mounts
    h.expect(system._mounts).to.deep.equal({
      "/azk/#{manifest.dir}/feedbin" : 'path("./feedbin")',
      "/azk/bundler"                 : 'persistent("bundler")',
      bundler_literal                : "bundler_literal_value",
    });
  });

  it('should generate a system from an Azkfile.js with the provision parameter', function () {
    var azkfile_system_content = [
      'var azkfile_system = { system001: {',
      '  provision: ["npm install"],',
      '} }',
    ].join('\n');

    var system = new System({ system_ast: getSystemFromAST(azkfile_system_content) });

    h.expect(system._name).to.equal('system001');

    // provision
    h.expect(system._provision).to.have.length(1);
    h.expect(system._provision[0]).to.equal('npm install');
  });

  it('should generate a system from an Azkfile.js with the command parameter', function () {
    var azkfile_system_content = [
      'var azkfile_system = { system001: {',
      '  command: "npm start",',
      '} }',
    ].join('\n');

    var system = new System({ system_ast: getSystemFromAST(azkfile_system_content) });

    h.expect(system._name).to.equal('system001');

    // command
    h.expect(system._command).to.equal("npm start");
  });

  it('should generate a system from an Azkfile.js with the shell parameter', function () {
    var azkfile_system_content = [
      'var azkfile_system = { system001: {',
      '  // default shell binary',
      '  shell: "/bin/bash",',
      '} }',
    ].join('\n');

    var system = new System({ system_ast: getSystemFromAST(azkfile_system_content) });

    h.expect(system._name).to.equal('system001');

    // shell
    h.expect(system._shell).to.equal("/bin/bash");
  });

  it('should generate a system from an Azkfile.js with the extends parameter', function () {
    var azkfile_system_content = [
      'var azkfile_system = { system001: {',
      '  extends: "app",',
      '} }',
    ].join('\n');

    var system = new System({ system_ast: getSystemFromAST(azkfile_system_content) });

    h.expect(system._name).to.equal('system001');

    // extends
    h.expect(system._extends).to.equal("app");
  });

  it('should generate a system from an Azkfile.js with the workdir parameter', function () {
    var azkfile_system_content = [
      'var azkfile_system = { system001: {',
      '  workdir: "/azk/#{manifest.dir}",',
      '} }',
    ].join('\n');

    var system = new System({ system_ast: getSystemFromAST(azkfile_system_content) });

    h.expect(system._name).to.equal('system001');

    // workdir
    h.expect(system._workdir).to.equal("/azk/#{manifest.dir}");
  });

  it('should generate a system from an Azkfile.js with the dns_servers parameter', function () {
    var azkfile_system_content = [
      'var azkfile_system = { system001: {',
      '  dns_servers: ["8.8.8.8", "4.4.4.4"],',
      '} }',
    ].join('\n');

    var system = new System({ system_ast: getSystemFromAST(azkfile_system_content) });

    h.expect(system._name).to.equal('system001');

    // dns_servers
    h.expect(system._dns_servers).to.have.length(2);
    h.expect(system._dns_servers[0]).to.equal('8.8.8.8');
    h.expect(system._dns_servers[1]).to.equal('4.4.4.4');
  });

  it('should generate a system from an Azkfile.js with the envs parameter', function () {
    var azkfile_system_content = [
      'var azkfile_system = { system001: {',
      '  envs: { ENV1: "MY GREAT ENV 1", ',
      '          ENV2: "MY WONDERFUL ENV 2" },',
      '} }',
    ].join('\n');

    var system = new System({ system_ast: getSystemFromAST(azkfile_system_content) });

    h.expect(system._name).to.equal('system001');

    // envs
    h.expect(system._envs).to.deep.equal({
      ENV1: "MY GREAT ENV 1",
      ENV2: "MY WONDERFUL ENV 2"
    });
  });

  it('should generate a system from an Azkfile.js with the export_envs parameter', function () {
    var azkfile_system_content = [
      'var azkfile_system = { system001: {',
      '  export_envs: { ENV1: "MY SAD ENV 1", ',
      '                 ENV2: "MY POOR ENV 2" },',
      '} }',
    ].join('\n');

    var system = new System({ system_ast: getSystemFromAST(azkfile_system_content) });

    h.expect(system._name).to.equal('system001');

    // export_envs
    h.expect(system._export_envs).to.deep.equal({
      ENV1: "MY SAD ENV 1",
      ENV2: "MY POOR ENV 2"
    });
  });

  it('should generate a system from an Azkfile.js with the ports parameter', function () {
    var azkfile_system_content = [
      'var azkfile_system = { system001: {',
      '  ports: {',
      '    http: "9200",',
      '    data: "5432/tcp",',
      '  },',
      '} }',
    ].join('\n');

    var system = new System({ system_ast: getSystemFromAST(azkfile_system_content) });

    h.expect(system._name).to.equal('system001');

    // ports
    h.expect(system._ports).to.deep.equal({
      http: "9200",
      data: "5432/tcp",
    });
  });

  it('should generate a system from an Azkfile.js with the scalable parameter', function () {
    var azkfile_system_content = [
      'var azkfile_system = { system001: {',
      '  scalable: {',
      '    default: 1,',
      '    limit: 2,',
      '  },',
      '} }',
    ].join('\n');

    var system = new System({ system_ast: getSystemFromAST(azkfile_system_content) });

    h.expect(system._name).to.equal('system001');

    // scalable
    h.expect(system._scalable).to.deep.equal({
      default: 1,
      limit: 2,
    });
  });

  it('should generate a system from an Azkfile.js with the wait parameter', function () {
    var azkfile_system_content = [
      'var azkfile_system = { system001: {',
      '  wait: {retry: 40, timeout: 10000},',
      '} }',
    ].join('\n');

    var system = new System({ system_ast: getSystemFromAST(azkfile_system_content) });

    h.expect(system._name).to.equal('system001');

    // wait
    h.expect(system._wait).to.deep.equal({
      retry: 40,
      timeout: 10000,
    });
  });
});
