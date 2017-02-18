"use strict";
class InvalidHookType extends Error {
    constructor() {
        super();
        this.message = "Function hook is invalid";
    }
}
exports.InvalidHookType = InvalidHookType;
