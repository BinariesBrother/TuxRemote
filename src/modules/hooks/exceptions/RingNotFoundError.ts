export class RingNotFoundError extends Error {
  constructor(ringName, keyringName) {
    super();
    this.message = ringName + " not found in rings of " + keyringName;
  }
}
