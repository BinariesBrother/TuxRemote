/**
 * Provide hook system.
 * Define Keyring and Ring classes.
 *
## How to use
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
 */
let keyrings = {};

class Keyring {

  constructor(name) {
    //Global Keyrings
    if (typeof keyrings == 'undefined') {
      keyrings = {};
    }
    if (typeof keyrings[name] != 'undefined') {
      throw new KeyringAlwaysExistError(name);
    }
    keyrings[name] = this;
    //Propertys
    this.name = name;
    this.rings = {};
  }

  pullRing(ringName) {
    if (typeof this.rings[ringName] != 'undefined') {
      var hookArgs = Array.prototype.slice.call(arguments, 1);
      var ring = this.rings[ringName];
      ring.pull.apply(ring, hookArgs);
    }
    else {
      throw new RingNotFoundError(ringName, this.name);
    }
  }

  createRing(ringName) {
    if (typeof this.rings[ringName] != 'undefined') {
      throw new RingAlwaysExistError(ringName);
    }
    var ring = new Ring(ringName);
    this.rings[ringName] = ring;
    return ring;
  }

  getRing(ringName) {
    if (typeof this.rings[ringName] == 'undefined') {
      throw new RingNotFoundError(ringName, this.name);
    }
    return this.rings[ringName];
  }

}

class Ring {
  //Optionals
  //arguments 23 : HookArray - constructor hookArray - default : new HookArray()
  constructor(name, hookArray) {
    //Propertys
    this.name = name;
    this.hookArray = new HookArray();//HookArray +/- == Array
    if (typeof hookArray == 'object' && hookArray.constructor == HookArray) {
      this.hookArray = hookArray;
    }
  }

  pull() {
    //Hook without arguments
    if (arguments.length == 0) {
      for (var i = 0; i < this.hookArray.length; i++) {
        var hook = this.hookArray[i];
        hook();
      }
    }
    //Hook with arguments
    else {
      for (var i = 0; i < this.hookArray.length; i++) {
        var hook = this.hookArray[i];
        hook.apply(hook, arguments);
      }
    }
  }

  hookValidator(hook) {
    if (typeof hook != 'function') {
      throw new InvalidHookTypeError();
    }
  }

  addHookAfter(hook, hookName) {
    this.hookValidator(hook);
    var indexOf = this.hookArray.indexOfHookNamed(hookName);
    if (indexOf == -1) {
      throw new HookNotExistError(hookName, this.name);
    }
    this.hookArray.splice(indexOf + 1, 0, hook);
  }

  addHookBefore(hook, hookName) {
    this.hookValidator(hook);
    var indexOf = this.hookArray.indexOfHookNamed(hookName);
    if (indexOf == -1) {
      throw new HookNotExistError(hookName, this.name);
    }
    this.hookArray.splice(indexOf, 0, hook);
  }

  addHookAfterAll(hook) {
    this.hookValidator(hook);
    this.hookArray.push(hook);
  }

  addHookBeforeAll(hook) {
    this.hookValidator(hook);
    this.hookArray.splice(0, 0, hook);
  }
}

//Custom array object
class HookArray extends Array {
  indexOfHookNamed(hookName) {
    if (typeof hookName == 'number') {
      if (hookName > this.length) {
        return -1
      }
      return hookName;
    }
    return this.map(function (hook) {
      return hook.name;
    }).indexOf(hookName);
  }
}

// --- Error classes

class KeyringAlwaysExistError extends Error {
  constructor(keyringName) {
    this.message = keyringName + " always exist";
  }
}

class RingNotFoundError extends Error {
  constructor(ringName, keyringName) {
    this.message = ringName + "' not found in rings of " + keyringName;
  }
}

class RingAlwaysExistError extends Error {
  constructor(ringName) {
    this.message = ringName + " always exist";
  }
}

class HookNotExistError extends Error {
  constructor(hookName, ringName) {
    this.message = hookName + " not exist in hook array of " + ringName;
  }
}

class InvalidHookType extends Error {
  constructor() {
    this.message = "Function hook is invalid";
  }
}

module.exports = {
  'Keyring': Keyring,
  'Ring': Ring,
};
