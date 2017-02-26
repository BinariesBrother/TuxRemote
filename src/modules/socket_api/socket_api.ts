import * as logger from "node-yolog";
import {io} from "../server/server";
import {invoke, defineHook, hook} from "../hooks/hooks";

defineHook("tuxRemote/socket/eventListener");

/**
 * Define SocketApi singleton class.
 * Also define some hooks:
 *   - tuxRemote/socket/eventListener
 *   - tuxRemote/log
 *
 * @class SocketApi
 */
class SocketApi {

  static instance: SocketApi;

  public events: Array<String>;

  private constructor() {
    this.events = [
      // defineHook("socket_api__running_apps"),
      defineHook("tuxRemote/log")
    ];
  }

  static getInstance() {
    if (!SocketApi.instance) {
      SocketApi.instance = new SocketApi();
    }
    return SocketApi.instance;
  }

  @hook("tuxRemote/socket/eventListener", () => SocketApi.getInstance())
  defineEventListener() { return this.events;}

  // @hook("socket_api__running_apps")
  // onRunningApps(socket, args) {
  //   // Allow other modules to populate the running app list.
  //   let running_app_list = invoke("socket_api__get_running_app_list");
  //   socket.emit("socket_api__running_apps", running_app_list);
  // }

  @hook("tuxRemote/log")
  log(socket: any, args: any[]) {
    for (let i in args) {
      logger.info("tuxRemote/log/ ", args[i]);
    }
  }
}

export function init() {

  io.on("connection", function(socket: any) {
    logger.info("Client connected.");

    let result = invoke("tuxRemote/socket/eventListener");
    for (let i in result) {
      let event = result[i];
      socket.on(event, (...args: any[]) => invoke(event, socket, args));
    }
  });

}