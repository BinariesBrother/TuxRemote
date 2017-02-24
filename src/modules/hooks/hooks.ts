import {Keyring} from "./src/Keyring";
import {Ring} from "./src/Ring";

let keyring: Keyring = new Keyring("tuxremote__hooks");

export function hook(name: string, contextCallback?: Function) {
  return function(target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
    let ring: Ring = keyring.getRing(name);
    let _context: Object = (contextCallback !== undefined)? contextCallback() : target;
    ring.addHookAfterAll(descriptor.value.bind(_context));
  };
}

export function invoke(name: string, ...args: any[]) {
  return keyring.pullRing.apply(keyring, arguments);
}

export function defineHook(name: string) {
  keyring.createRing(name);
  return name;
}
