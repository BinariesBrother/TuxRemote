# Client Module

The client module provide the main files to build the front-end of the TuxRemote application.

It's also provide hooks to allow other modules to add your own menu entries on the tux-drawer custom element.

## Hooks

### *tuxRemote/client/registerMenu*

> Allow other modules to add your own menu entries on the admin menu.

~~~js
@hook("tuxRemote/client/registerMenu")
registerMenu() {
  return [{
    label: "<MODULE_NAME>",
    menu_entries: [
      {
        label: "<ENTRY_LABEL>",
        icon: "<ICON_PATH>",
        view: "<POLYMER_COMPONENT_NAME>",
      }
    ]
  }],
}
~~~

#### Main module menu

| property     | required | description |
|--------------|----------|-------------|
| label        | true     | The main module menu entry label. |
| menu_entries | true     | An array of menu entry object describe below. |

#### Menu entry

| property | required | description |
|----------|----------|-------------|
| label    | true     | The entry label display as a menu item |
| icon     | false    | An icon path relative to the static_path or an icon name from an available icon svg definition (eg. `"<module>-icons:add"`). |
| view     | true     | A Polymer custom element. The view file must be a direct child of the static folder defined above. |


A Polymer component view can work with some behaviors:
* ClientSocketBehavior -> Allow polymer component to work with the main websocket.


### *tuxRemote/client/registerStatic*

Allow other modules to add your own static path. Useful if the module want to add a view component.
Each callback attached to this hook must return an array of string.

~~~js
@hook("tuxRemote/client/registerStatic")
onRegisterStatic() {
  return [
    'my-module/static/path'
  ];
}
~~~