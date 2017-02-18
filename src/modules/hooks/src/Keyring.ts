import {Ring} from "./Ring";
import {KeyringAlwaysExistError} from "../exceptions/KeyringAlwaysExistError";
import {RingNotFoundError} from "../exceptions/RingNotFoundError";
import {RingAlwaysExistError} from "../exceptions/RingAlwaysExistError";

export class Keyring {
  static keyrings: Object;

  private name: string;
  private rings: Object;

  constructor(name: string) {
    // Global Keyrings.
    if (typeof Keyring.keyrings === "undefined") {
      Keyring.keyrings = {};
    }
    if (typeof Keyring.keyrings[name] !== "undefined") {
      throw new KeyringAlwaysExistError(name);
    }
    Keyring.keyrings[name] = this;
    // Propertys
    this.name = name;
    this.rings = {};
  }

  pullRing(ringName: string) {
    if (typeof this.rings[ringName] !== "undefined") {
      let hookArgs = Array.prototype.slice.call(arguments, 1);
      let ring = this.rings[ringName];
      return ring.pull.apply(ring, hookArgs);
    }
    else {
      throw new RingNotFoundError(ringName, this.name);
    }
  }

  createRing(ringName: string) {
    if (typeof this.rings[ringName] !== "undefined") {
      throw new RingAlwaysExistError(ringName);
    }
    let ring = new Ring(ringName);
    this.rings[ringName] = ring;
    return ring;
  }

  getRing(ringName: string) {
    if (typeof this.rings[ringName] === "undefined") {
      throw new RingNotFoundError(ringName, this.name);
    }
    return this.rings[ringName];
  }

}
