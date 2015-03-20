import { _ } from 'azk-core';
import Generator from '../generator';
import Systems from './syntaxes/systems';
import System  from './syntaxes/system';

/**
 * AzkParser
 * parse, create and modify Azkfile.js
 */
class AzkParser {
  constructor(options) {
    var default_options = {
    };

    this._options = {};
    _.assign(this._options, default_options);
    _.assign(this._options, options);

    this._generator = new Generator();
  }

  _getSystems() {
    var systems = new Systems();
    return systems;
  }

  _getSystem(system_name) {
    var system = new System({ name: system_name });
    return system;
  }

  _generateSystems() {
    var systems = this._getSystems();
    return this._generator.generate(systems.syntax);
  }

  _generateSystem(system_name) {
    var system = this._getSystem(system_name);
    return this._generator.generate(system.syntax);
  }

  _addSystemToSystems(systems, system) {
    systems.add(system);
    return systems;
  }

}

module.exports = AzkParser;
