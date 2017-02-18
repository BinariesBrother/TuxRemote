export class InvalidHookType extends Error {
  constructor() {
    super();
    this.message = "Function hook is invalid";
  }
}
