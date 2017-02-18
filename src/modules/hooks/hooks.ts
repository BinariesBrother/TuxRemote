import {Keyring} from "./src/Keyring";
import {Ring} from "./src/Ring";

let keyring: Keyring = new Keyring("tuxremote__hooks");

export function hook(name: string, context: Function = null) {
  return function(target, propertyKey: string, descriptor: PropertyDescriptor) {
    let ring: Ring = keyring.getRing(name);
    context = (context !== undefined) ? context : target;
    context = (typeof context === "function") ? context() : context;
    ring.addHookAfterAll(descriptor.value.bind(context));
  };
}

export function invoke(name: string, ...args) {
  return keyring.pullRing.apply(keyring, arguments);
}

export function defineHook(name: string) {
  keyring.createRing(name);
  return name;
}
