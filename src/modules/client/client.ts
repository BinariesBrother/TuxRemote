import * as express from "express";
import * as logger from "node-yolog";
import * as path from "path";

import {hook, defineHook, invoke} from "../hooks/hooks";
import {app} from "../server/server";

defineHook("tuxRemote/client/registerMenu");

let appDir = path.dirname(require.main.filename);

let static_dirs = [
  appDir + "/static/", // Global static folder.
  __dirname + "/app/",
];

logger.debug("Static folders are:");
for (let i in static_dirs) {
  app.use(express.static(static_dirs[i]));
  logger.debug(static_dirs[i]);
}


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

  private constructor() {
    this.events = [
      defineHook("tuxRemote/client/getAdminMenu"),
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

  @hook("tuxRemote/client/getAdminMenu")
  onAdminMenuRegister(socket, args) {
    let menu_items = invoke("tuxRemote/client/registerMenu");
    logger.debug(menu_items);
  }

}
