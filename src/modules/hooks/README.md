## API
| decorator | description |
|-----------|-------------|
| hook      | Use to register a callback to a named hook. The first parameter is the hook name, the optional second parameter is a function that returns the context to use in the registered callback |

| Function | description |
|----------|-------------|
| invoke   | Use this function to trigger a hook. You can add as many parameters as you like after the hook name. |
| defineHook | Use this function to register a new hook intance. |

## How to use

Make sure to use the defineHook function before any call to hook function.

On a module that define and use hooks:
~~~js
import {invoke, defineHook} from "../hooks/hooks";
defineHook("my_hook");
invoke("my_hook");
~~~

On module that implements defined hooks:
~~~js
import {hook} from "../hook/hook";

class MyClass {

  @hook("my_hook")
  myHookCallback() {
    // Your code here.
  }

  @hook("my_hook", () => { my_context_property: 42 })
  myHookCallbackWithContext() {
    // Your code here.
    // "this" refers to the context passed above.
  }
}
~~~


## Original - How to use

~~~js
new Keyring('testKeyring1');
new Keyring('testKeyring2');
console.log(keyrings);//Global exist ?

//Create ring
var testKeyRing1 = keyrings.testKeyring1;
var testRing1 = testKeyRing1.createRing('testRing1');

//Create 2 hooks
function testHook1(arg1, arg2, blabla) {
  arg1.testHook1 = 'item3';
}
;
//Or function required a name
function testHook2(arg1, arg2, blabla) {
  arg1.testHook2 = 'item4';
  arg2.push('item4');
  blabla = 'tiem4';
}
;

//Add 2 hooks on ring
testRing1.addHookAfterAll(testHook1);
testRing1.addHookAfterAll(testHook2);

//Pull ring
var arg1 = {};
var arg2 = [];
var blabla = 'blabla';
testKeyRing1.pullRing('testRing1', arg1, arg2, blabla);
console.log(arg1);
console.log(arg2);
console.log(blabla);
~~~
