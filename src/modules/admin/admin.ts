import {hook, defineHook, invoke} from "../hooks/hooks";

import * as logger from "node-yolog";

defineHook("tuxRemote/client/registerMenu");
defineHook("tuxRemote/client/registerStatic");

export class Admin{

  private static instance: Admin;

  public events: string[];

  private constructor() {
    this.events = [
      defineHook("tuxRemote/client/getAdminMenu"),
    ];
  }

  public static getInstance(): Admin {
    if (!this.instance) {
      this.instance = new Admin();
    }
    return this.instance;
  }

  @hook("tuxRemote/socket/eventListener", () => this.getInstance())
  onEventListener() {
    return this.events;
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