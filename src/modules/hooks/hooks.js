"use strict";
const Keyring_1 = require("./src/Keyring");
let keyring = new Keyring_1.Keyring("tuxremote__hooks");
function hook(name, contextCallback) {
    return function (target, propertyKey, descriptor) {
        let ring = keyring.getRing(name);
        let _context = (contextCallback !== undefined) ? contextCallback() : target;
        ring.addHookAfterAll(descriptor.value.bind(_context));
    };
}
exports.hook = hook;
function invoke(name, ...args) {
    return keyring.pullRing.apply(keyring, arguments);
}
exports.invoke = invoke;
function defineHook(name) {
    keyring.createRing(name);
    return name;
}
exports.defineHook = defineHook;
