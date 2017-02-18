import {HookArray} from "./HookArray";
import {InvalidHookType} from "../exceptions/InvalidHookType";
import {HookNotExistError} from "../exceptions/HookNotExistError";

export class Ring {

  private name: string;
  private hookArray: HookArray;

  constructor(name: string, hookArray: HookArray = null) {
    this.name = name;
    this.hookArray = new HookArray(); // HookArray +/- == Array
    if (hookArray !== null) {
      this.hookArray = hookArray;
    }
  }

  pull() {
    let result = [];
    // Hook without arguments
    if (arguments.length === 0) {
      for (let i = 0; i < this.hookArray.length; i++) {
        let hook = this.hookArray[i];
        result = result.concat(hook());
      }
    }
    // Hook with arguments
    else {
      for (let i = 0; i < this.hookArray.length; i++) {
        let hook = this.hookArray[i];
        result = result.concat(hook.apply(hook, arguments));
      }
    }
    return result;
  }

  hookValidator(hook) {
    if (typeof hook !== "function") {
      throw new InvalidHookType();
    }
  }

  addHookAfter(hook, hookName) {
    this.hookValidator(hook);
    let indexOf = this.hookArray.indexOfHookNamed(hookName);
    if (indexOf === -1) {
      throw new HookNotExistError(hookName, this.name);
    }
    this.hookArray.splice(indexOf + 1, 0, hook);
  }

  addHookBefore(hook, hookName) {
    this.hookValidator(hook);
    let indexOf = this.hookArray.indexOfHookNamed(hookName);
    if (indexOf === -1) {
      throw new HookNotExistError(hookName, this.name);
    }
    this.hookArray.splice(indexOf, 0, hook);
  }

  addHookAfterAll(hook) {
    this.hookValidator(hook);
    this.hookArray.push(hook);
  }

  addHookBeforeAll(hook) {
    this.hookValidator(hook);
    this.hookArray.splice(0, 0, hook);
  }
}
