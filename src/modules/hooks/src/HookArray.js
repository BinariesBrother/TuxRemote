"use strict";
class HookArray extends Array {
    indexOfHookNamed(hookName) {
        if (typeof hookName === "number") {
            if (hookName > this.length) {
                return -1;
            }
            return hookName;
        }
        return this.map(function (hook) {
            return hook.name;
        }).indexOf(hookName);
    }
}
exports.HookArray = HookArray;
