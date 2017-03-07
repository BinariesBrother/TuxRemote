import {JsonProperty} from 'json-typescript-mapper';
import {MenuEntry} from './MenuEntry';

export class Menu{
  @JsonProperty("label")
  label: String;

  @JsonProperty({clazz: MenuEntry, name:"menuEntries"})
  menuEntries: MenuEntry[]= [];
}