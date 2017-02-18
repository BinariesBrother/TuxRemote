# Socket API module

Provide useful hooks to work with socket events.

| Hook | description |
|------|-------------|
| socket_api__running_apps | The client want to get the running app list. |
| socket_api__get_running_app_list | Allow other modules to populate the running app list. |
| socket_api__log | The client want to log a message on the server side. |
| socket_api__event_listener | Allows other modules to set their own listenable event on the socket. Call the invoke function with the event, socket and parameters sent by the client for this event, so be certain to define before the hook via the defineHook function. |

## How to use socket_api__event_listener

Your module must have `socket_api` module as dependency.
~~~js
import {hook, defineHook} from "../hook/hook";

class HandleSocketApi {

  @hook("socket_api__event_listener", () => [
      // defineHook and use it in callback context.
      // defineHook return the hook name.
      defineHook("socket_event"),
      defineHook("other_socket_event")
    ])
  defineEventListener() { return this; }

  @hook("socket_event")
  onSocketEvent(socket, args) {
    // Your code here
  }

  @hook("socket_api__get_running_app_list")
  onGetRunningAppList() {
    return ["app1","app2"]; // TODO replace string name with app object.
  }
}

~~~
