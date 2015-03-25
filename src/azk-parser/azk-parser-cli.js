import { _ } from 'azk-core';
// import Parser from '../parser';
// import Generator from '../generator';
// var generator = new Generator();
import fileUtils from '../file-utils';
var bb = require('bluebird');
var spawn = bb.coroutine;
import AzkParser from './index';
var azkParser = new AzkParser();

// import System  from './syntaxes/system';

/**
 * AzkParserCli
 * command-line client parse, create and modify Azkfile.js
 */
class AzkParserCli {
  constructor(options) {
    var default_options = {
    };

    this._options = {};

    _.assign(this._options, default_options);
    _.assign(this._options, options);

    this._systems_list = null;
  }

  load(azkfile_path) {
    return spawn(function* (azkfile_path) {
      var file_content = yield fileUtils.read(azkfile_path);
      this._systems_list = azkParser.parse(file_content);
    }.bind(this))(azkfile_path);
  }

  save(azkfile_path) {
    return spawn(function* (azkfile_path) {
      var code = azkParser.generateAzkfileFromAst(this._systems_list.convert_to_ast());
      yield fileUtils.write(azkfile_path, code);
      return code;
    }.bind(this))(azkfile_path);
  }

  listAllSystems() {
    return _.map(this._systems_list._all_systems, function(sys) {
      return sys.name;
    });
  }

  getSystemByName(system_name) {
    return this._systems_list.findByName(system_name);
  }

  addSystems(azkfile_path) {
    return spawn(function* (azkfile_path) {
      var file_content = yield fileUtils.read(azkfile_path);
      var azkParser = new AzkParser();
      var new_systems_list = azkParser.parse(file_content);

      this._systems_list._all_systems = this._systems_list._all_systems.concat(new_systems_list._all_systems);

    }.bind(this))(azkfile_path);
  }
}

module.exports = AzkParserCli;
