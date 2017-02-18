"use strict";
const Keyring_1 = require("./src/Keyring");
let keyring = new Keyring_1.Keyring("tuxremote__hooks");
function hook(name, context = null) {
    return function (target, propertyKey, descriptor) {
        let ring = keyring.getRing(name);
        context = (context !== undefined) ? context : target;
        context = (typeof context === "function") ? context() : context;
        ring.addHookAfterAll(descriptor.value.bind(context));
    };
}
exports.hook = hook;
function invoke(name, ...args) {
    keyring.pullRing.apply(keyring, arguments);
}
exports.invoke = invoke;
function defineHook(name) {
    keyring.createRing(name);
}
exports.defineHook = defineHook;
