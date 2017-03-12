import {hook, defineHook, invoke} from "../hooks/hooks";
import {Menu} from "./menu/Menu"

import * as logger from "node-yolog";

defineHook("tuxRemote/admin/registerMenu");

export class Admin{

  private static instance: Admin;

  public events: string[];

  private lock = {}

  private constructor() {
    this.events = [
      defineHook("tuxRemote/admin/getAdminMenu"),
    ];
  }

  public static getInstance(): Admin {
    if (!this.instance) {
      this.instance = new Admin();
    }
    return this.instance;
  }

  @hook("tuxRemote/socket/eventListener", () => Admin.getInstance())
  onEventListener() {
    return this.events;
  }

  @hook("tuxRemote/admin/getAdminMenu", () => Admin.getInstance())
  onAdminMenuRegister(socket, args) {
    let menu_items : Menu[]= invoke("tuxRemote/admin/registerMenu");
    //socket.emit("tuxRemote/admin/setAdminMenu", menu_items);
  }

}

export function init(){
  logger.trace(invoke("tuxRemote/admin/registerMenu"));
  
}