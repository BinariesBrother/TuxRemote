export class HookNotExistError extends Error {
  constructor(hookName, ringName) {
    super();
    this.message = hookName + " not exist in hook array of " + ringName;
  }
}
