import * as fs from "fs";
import * as logger from 'node-yolog';
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
export class ModuleInfo {

  public name: string;
  public path: string;
  public JSONPath: string;
  public jsPath: string;
  public infos: any;

  constructor(name: string, path: string) {
    this.name = name;
    this.path = path;
    this.JSONPath = path +'/'+ name +'/'+ name +'.json';
    this.jsPath = path +'/'+ name +'/'+ name +'.js';
    this.infos = JSON.parse(fs.readFileSync(this.JSONPath, {"encoding" : "utf8"}));
  }

  get deps() {
    return this.infos.deps;
  }

}

/**
 * ModuleManager main class.
 */
export class ModuleManager {

  public modulePaths: string[];
  public modules: ModuleInfo[];
  public moduleInstances: Object;

  constructor() {
    this.moduleInstances = {};
    this.modulePaths = [
      __dirname + '/modules',
    ];
    this.modules = [];
    //populate this.modules
    this.getModules();
  }

  /**
   * Call the require function for each modules.
   * Populate the moduleInstances with instance retruned by the require call.
   *
   * @memberOf ModuleManager
   */
  public loadAll() {
    for (let module in this.modules) {
      if (this.modules.hasOwnProperty(module)) {
        this.load(this.modules[module]);
      }
    }
  }

  public load(module: ModuleInfo) {
    logger.info("# Load module:", module.name);
    this.moduleInstances[module.name] = require(module.jsPath);
  }

  /**
   * Call the init function fro each loaded modules.
   *
   * @memberOf ModuleManager
   */
  public initAll() {
    for (let module in this.moduleInstances) {
      if (this.moduleInstances.hasOwnProperty(module)) {
        let instance = this.moduleInstances[module];
        if (instance.hasOwnProperty('init') && typeof instance.init == 'function') {
          logger.info("# Initialize module:", module);
          this.moduleInstances[module].init();
        }
      }
    }
  }

  protected _addModule(module: ModuleInfo) {
    if (!this.findModuleByName(module.name)) {
      this.modules.push(module);
    }
  }

  public getModules() {
    for (let i in this.modulePaths) {
      let path = this.modulePaths[i];
      let modulesName = this._getModulesName(path);
      this._getModules(modulesName, path);
    }
  }

  /**
   * Get modules recursively
   */
  protected _getModules(modulesName: string[], path: string) {
    for (let j in modulesName) {
      let name = modulesName[j];
      let module = new ModuleInfo(name, path)
      //add dependency modules
      let deps = module.deps;
      this._getModules(deps, path);
      for(let k in deps) {
        let dep_name = deps[k];
        this._addModule(new ModuleInfo(dep_name, path));
      }
      this._addModule(module);
    }
  }

  protected _getModulesName(path: string) {
    try {
      return fs.readdirSync(path);
    }
    catch (e) {
      return [];
    }
  }

  public findModuleByName(name: string) {
    for(let i in this.modules) {
      if (name == this.modules[i].name) {
        return true;
      }
    }
    return false;
  }

}
