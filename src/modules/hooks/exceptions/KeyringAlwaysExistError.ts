export class KeyringAlwaysExistError extends Error {
  constructor(keyringName) {
    super();
    this.message = keyringName + " always exist";
  }
}
