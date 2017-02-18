import * as logger  from "node-yolog";
import {io} from "../server/server";
import {invoke, defineHook, hook} from "../hooks/hooks";

defineHook("socket_api__event_listener");
defineHook("socket_api__get_running_app_list");

class SocketApi {

  @hook("socket_api__event_listener", () => [
      // defineHook and use it in callback context.
      // defineHook return the hook name.
      defineHook("socket_api__running_apps"),
      defineHook("socket_api__log")
    ])
  defineEventListener() { return this; }

  @hook("socket_api__running_apps")
  onRunningApps(socket, args) {
    // Allow other modules to populate the running app list.
    let running_app_list = invoke("socket_api__get_running_app_list");
    socket.emit("socket_api__running_apps", running_app_list);
  }

  @hook("socket_api__log")
  log(socket, args) {
    for (let i in args) {
      logger.info("socket_api__log:", args[i]);
    }
  }
}

io.on("connection", function(socket) {
  logger.info("Client connected.");

  let result = invoke("socket_api__event_listener");
  for (let i in result) {
    let event = result[i];
    socket.on(event, (...args) => invoke(event, socket, args));
  }

});
