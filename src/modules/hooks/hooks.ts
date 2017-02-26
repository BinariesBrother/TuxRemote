import {Keyring} from "./src/Keyring";
import {Ring} from "./src/Ring";

let keyring: Keyring = new Keyring("tuxremote__hooks");

/**
 * Shorthand decorator to use hooks system.
 *
 * @export
 * @param {string} name
 * @param {Function} [contextCallback]
 * @returns
 */
export function hook(name: string, contextCallback?: Function) {
  return function(target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
    let ring: Ring = keyring.getRing(name);
    let _context: Object = (contextCallback !== undefined)? contextCallback() : target;
    ring.addHookAfterAll(descriptor.value.bind(_context));
  };
}

/**
 * Shorthand function to trigger a hook.
 *
 * @export
 * @param {string} name
 * @param {...any[]} args
 * @returns
 */
export function invoke(name: string, ...args: any[]) {
  return keyring.pullRing.apply(keyring, arguments);
}

/**
 * Use this function before any call to the hook decorator or the invoke functions.
 *
 * @export
 * @param {string} name
 * @returns
 */
export function defineHook(name: string) {
  keyring.createRing(name);
  return name;
}

export function init() {

}