"use strict";
class RingAlwaysExistError extends Error {
    constructor(ringName) {
        super();
        this.message = ringName + " always exist";
    }
}
exports.RingAlwaysExistError = RingAlwaysExistError;
