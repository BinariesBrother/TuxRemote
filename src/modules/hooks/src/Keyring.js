"use strict";
const Ring_1 = require("./Ring");
const KeyringAlwaysExistError_1 = require("../exceptions/KeyringAlwaysExistError");
const RingNotFoundError_1 = require("../exceptions/RingNotFoundError");
const RingAlwaysExistError_1 = require("../exceptions/RingAlwaysExistError");
class Keyring {
    constructor(name) {
        if (typeof Keyring.keyrings === "undefined") {
            Keyring.keyrings = {};
        }
        if (typeof Keyring.keyrings[name] !== "undefined") {
            throw new KeyringAlwaysExistError_1.KeyringAlwaysExistError(name);
        }
        Keyring.keyrings[name] = this;
        this.name = name;
        this.rings = {};
    }
    pullRing(ringName) {
        if (typeof this.rings[ringName] !== "undefined") {
            let hookArgs = Array.prototype.slice.call(arguments, 1);
            let ring = this.rings[ringName];
            return ring.pull.apply(ring, hookArgs);
        }
        else {
            throw new RingNotFoundError_1.RingNotFoundError(ringName, this.name);
        }
    }
    createRing(ringName) {
        if (typeof this.rings[ringName] !== "undefined") {
            throw new RingAlwaysExistError_1.RingAlwaysExistError(ringName);
        }
        let ring = new Ring_1.Ring(ringName);
        this.rings[ringName] = ring;
        return ring;
    }
    getRing(ringName) {
        if (typeof this.rings[ringName] === "undefined") {
            throw new RingNotFoundError_1.RingNotFoundError(ringName, this.name);
        }
        return this.rings[ringName];
    }
}
exports.Keyring = Keyring;
