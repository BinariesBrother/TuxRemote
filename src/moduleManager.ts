/**
 * Common class to represent a TuxRemote module.
 * json file like:
 *  {
 *    "deps": [
 *      "other_module",
 *    ]
 *  }
 */
import * as fs from "fs";

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

  constructor() {
    this.modulePaths = [
      __dirname + '/modules',
    ];
    this.modules = [];
    //populate this.modules
    this.getModules();
    // console.log(this.modules);
  }

  loadAll() {
    for (let module in this.modules) {
      if (this.modules.hasOwnProperty(module)) {
        require(this.modules[module].jsPath);
      }
    }
  }

  _addModule(module: ModuleInfo) {
    if (!this.findModuleByName(module.name)) {
      this.modules.push(module);
    }
  }

  getModules() {
    for (let i in this.modulePaths) {
      let path = this.modulePaths[i];
      let modulesName = this._getModulesName(path);
      this._getModules(modulesName, path);
    }
  }

  /**
   * Get modules recursively
   */
  _getModules(modulesName: string[], path: string) {
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

  _getModulesName(path: string) {
    try {
      return fs.readdirSync(path);
    }
    catch (e) {
      return [];
    }
  }

  findModuleByName(name: string) {
    for(let i in this.modules) {
      if (name == this.modules[i].name) {
        return true;
      }
    }
    return false;
  }

}
