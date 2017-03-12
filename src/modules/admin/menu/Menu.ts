import {JsonProperty} from 'json-typescript-mapper';
import {MenuEntry} from './MenuEntry';

export class Menu{
  
  @JsonProperty("module-name")
  moduleName: String;

  @JsonProperty("label")
  label: String;

  @JsonProperty({clazz: MenuEntry, name:"menuEntries"})
  menuEntries: MenuEntry[]= [];

  public addEntries(label, icon, view){
    this.menuEntries.push(MenuEntry.new(label, icon, view));
  }
}