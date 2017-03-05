import * as express from "express";
import * as logger from "node-yolog";

import {hook, defineHook, invoke} from "../hooks/hooks";
import {app} from "../server/server";

defineHook("tuxRemote/client/registerMenu");
defineHook("tuxRemote/client/registerStatic");

/**
 * Provide hooks to allow other modules to include your own admin menu and Polymer component view.
 *
 * listen to:
 *  - tuxRemote/client/getAdminMenu
 *
 * invoke:
 *  - tuxRemote/client/registerMenu
 *
 * @class ClientSocketApi
 */
class ClientSocketApi {

  private static instance: ClientSocketApi;
  public events: string[];
  public staticDirs: string[];

  private constructor() {
    this.events = [
      defineHook("tuxRemote/client/getAdminMenu"),
    ];

    this.staticDirs = [
      require.main.exports.appDirectory + "/static/", // Global static folder.
      __dirname + "/app/",
    ];

  }

  public static getInstance() {
    if (!ClientSocketApi.instance) {
      ClientSocketApi.instance = new ClientSocketApi();
    }
    return ClientSocketApi.instance;
  }

  @hook("tuxRemote/socket/eventListener", () => ClientSocketApi.getInstance())
  onEventListener() {
    return this.events;
  }

  @hook("tuxRemote/client/registerStatic", () => ClientSocketApi.getInstance())
  onRegisterStatic() {
    return this.staticDirs;
  }

  @hook("tuxRemote/client/getAdminMenu")
  onAdminMenuRegister(socket, args) {
    let menu_items = invoke("tuxRemote/client/registerMenu");
    logger.trace(menu_items);
    socket.emit("tuxRemote/client/setAdminMenu", menu_items);
  }

  @hook("tuxRemote/client/registerMenu")
  onRegisterMenu() {
    return [{
      label: "Test Register Menu",
      menu_entries: [
        {
          label: "Entry 1",
          icon: "<ICON_PATH>",
          view: "<POLYMER_COMPONENT_NAME>",
        }
      ]
    }];
  }

}

export function init() {
  logger.debug("Static folders are:");
  let static_dirs = invoke("tuxRemote/client/registerStatic");
  for (let i in static_dirs) {
    app.use(express.static(static_dirs[i]));
    logger.debug(static_dirs[i]);
  }
}