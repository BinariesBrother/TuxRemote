import {hook, defineHooks, invoke} from "../../hooks/hooks";
import {Menu} from "../../admin/menu/Menu";
import  * as logger from "node-yolog";

export class Administration {

	static instance : Administration;

	events: string[];

	private constructor(){
    //this.events = defineHooks([]);
  }

  public static getInstance(){
    if(!this.instance){
      this.instance = new Administration();
    }
    return this.instance;
  }

  @hook("tuxRemote/admin/registerMenu", () => Administration.getInstance())
  onRegisterMenu() : Menu[]{
    let menu : Menu = new Menu();
    menu.label = "OS Controller";
    menu.addEntries("Aplication","application-icon", "view");
    menu.addEntries("Vues","view-icon", "view2");
    menu.addEntries("Commandes","commande-icon", "view2");
    menu.addEntries("Commandes Types","commande-type-icon", "view2");
    logger.trace(menu);
    return [menu];
  }
}