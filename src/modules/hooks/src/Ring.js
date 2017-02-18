"use strict";
const HookArray_1 = require("./HookArray");
const InvalidHookType_1 = require("../exceptions/InvalidHookType");
const HookNotExistError_1 = require("../exceptions/HookNotExistError");
class Ring {
    constructor(name, hookArray = null) {
        this.name = name;
        this.hookArray = new HookArray_1.HookArray();
        if (hookArray !== null) {
            this.hookArray = hookArray;
        }
    }
    pull() {
        let result = [];
        if (arguments.length === 0) {
            for (let i = 0; i < this.hookArray.length; i++) {
                let hook = this.hookArray[i];
                result = result.concat(hook());
            }
        }
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
            throw new InvalidHookType_1.InvalidHookType();
        }
    }
    addHookAfter(hook, hookName) {
        this.hookValidator(hook);
        let indexOf = this.hookArray.indexOfHookNamed(hookName);
        if (indexOf === -1) {
            throw new HookNotExistError_1.HookNotExistError(hookName, this.name);
        }
        this.hookArray.splice(indexOf + 1, 0, hook);
    }
    addHookBefore(hook, hookName) {
        this.hookValidator(hook);
        let indexOf = this.hookArray.indexOfHookNamed(hookName);
        if (indexOf === -1) {
            throw new HookNotExistError_1.HookNotExistError(hookName, this.name);
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
exports.Ring = Ring;
