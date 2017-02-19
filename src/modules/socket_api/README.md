# Socket API module

Provide useful hooks to work with socket events.

| Hook | description |
|------|-------------|
| tuxRemote/log | The client want to log a message on the server side. |
| tuxRemote/socket/eventListener | Allows other modules to set their own listenable event on the socket. Call the invoke function with the event, socket and parameters sent by the client for this event, so be certain to define before the hook via the defineHook function. |

## How to use socket_api__event_listener

Your module must have `socket_api` module as dependency.
~~~js
import {hook, defineHook} from "../hook/hook";

class HandleSocketApi {

  static instance: HandleSocketApi;

  public events: Array<String>;

  private constructor() {
    this.events = [
      defineHook("socket_event"),
      defineHook("other_socket_event")
    ];
  }

  static getInstance() {
    if (!HandleSocketApi.instance) {
      HandleSocketApi.instance = new HandleSocketApi();
    }
    return HandleSocketApi.instance;
  }

  @hook("tuxRemote/socket/eventListener", () => HandleSocketApi.getInstance())
  defineEventListener() { return this.events; }

  @hook("socket_event")
  onSocketEvent(socket, args) {
    // Your code here
  }
}

~~~
