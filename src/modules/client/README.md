# Client Module

The client module provide the main files to build the front-end of the TuxRemote application.

It's also provide hooks to allow other modules to add your own static directories.

## Hooks

### *tuxRemote/client/registerStatic*

Allow other modules to add your own static path. Useful if the module want to add a view component.
Each callback attached to this hook must return an array of one object {[key:string]: string}.

~~~js
@hook("tuxRemote/client/registerStatic")
onRegisterStatic() {
  return [{
    '/my_virtual_directory/': 'my-module/static/path',
  }];
}
~~~