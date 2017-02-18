import {hook, invoke, defineHook} from "../hooks";

defineHook("my_hook");

class TestHooks {

  private test: string = "test property private";
  public test2: string = "test property public";

  static instance: TestHooks;

  private constructor() {};

  static getInstance() {
    if (!TestHooks.instance) {
      TestHooks.instance = new TestHooks();
    }
    return TestHooks.instance;
  }

  @hook("my_hook")
  handleMyHook (a1, a2) {
    console.log(a1, a2);
  }

  @hook("my_hook", () => TestHooks.getInstance())
  handleMyHookWithContext (a1, a2) {
    console.log(a1, a2, this.test, this.test2);
  }
}

let test = TestHooks.getInstance();

invoke("my_hook", "arg1", 42);
