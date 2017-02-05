/**
 * Common class to represent a TuxRemote module.
 * json file like:
 *  {
 *    "deps": [
 *      "other_module",
 *    ]
 *  }
 */

/**
 * Short class to represent a module.
 */
class ModuleInfo {

  constructor(name, path) {
    this.name = name;
    this.path = path;
    this.JSONPath = path +'/'+ name +'/'+ name +'.json';
    this.jsPath = path +'/'+ name +'/'+ name +'.js';
    this.infos = JSON.parse(require('fs').readFileSync(this.JSONPath, {"encoding" : "utf8"}));
  }

  get deps() {
    return this.infos.deps;
  }

}

/**
 * ModuleManager main class.
 */
class ModuleManager {

  constructor() {
    this.fs = require('fs');
    this.path = require('path');
    this.modulePaths = [
      __dirname + '/modules',
    ];
    this.modules = [];
    //populate this.modules
    this.getModules();
    // console.log(this.modules);
  }

  loadAll() {
    for (var module in this.modules) {
      if (this.modules.hasOwnProperty(module)) {
        require(this.modules[module].jsPath);
      }
    }
  }

  _addModule() {
    var module = (arguments[0] instanceof ModuleInfo)? arguments[0] : new ModuleInfo(arguments[0], arguments[1]);
    if (!this.findModuleByName(module.name)) {
      this.modules.push(module);
    }
  }

  getModules() {
    for (var i in this.modulePaths) {
      var path = this.modulePaths[i];
      var modulesName = this._getModulesName(path);
      this._getModules(modulesName, path);
    }
  }

  /**
   * Get modules recursively
   */
  _getModules(modulesName, path) {
    for (var j in modulesName) {
      var name = modulesName[j];
      var module = new ModuleInfo(name, path)
      //add dependency modules
      var deps = module.deps;
      this._getModules(deps, path);
      for(var k in deps) {
        var dep_name = deps[k];
        this._addModule(dep_name, path);
      }
      this._addModule(module);
    }
  }

  _getModulesName(path) {
    try {
      return this.fs.readdirSync(path);
    }
    catch (e) {
      return [];
    }
  }

  findModuleByName(name) {
    for(var i in this.modules) {
      if (name == this.modules[i].name) {
        return true;
      }
    }
    return false;
  }

}

module.exports = ModuleManager;
