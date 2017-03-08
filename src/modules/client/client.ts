import * as express from "express";
import * as logger from "node-yolog";

import {hook, defineHook, invoke} from "../hooks/hooks";
import {app} from "../server/server";

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
  public staticDirs: { [virtual:string]: string };

  private constructor() {

    this.staticDirs = {
      '/bower_components': require.main.exports.appDirectory + "/static/bower_components/",
      '/core': __dirname + "/app/src/",
    };

  }

  public static getInstance() {
    if (!ClientSocketApi.instance) {
      ClientSocketApi.instance = new ClientSocketApi();
    }
    return ClientSocketApi.instance;
  }

  @hook("tuxRemote/client/registerStatic", () => ClientSocketApi.getInstance())
  onRegisterStatic() {
    return [this.staticDirs];
  }

}

export function init() {
  logger.debug("Static folders are:");
  let static_dirs = invoke("tuxRemote/client/registerStatic");
  for (let i in static_dirs) {
    for (var key in static_dirs[i]) {
      app.use(key, express.static(static_dirs[i][key]));
      logger.debug(key, static_dirs[i][key]);
    }
  }

  app.get('/', function(req, res) {
    res.sendFile(__dirname + "/app/index.html");
  });
}