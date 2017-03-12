import {JsonProperty} from 'json-typescript-mapper';

export class MenuEntry{

  @JsonProperty("label")
  label: string;

  @JsonProperty("icon")
  icon: string;

  @JsonProperty("view")
  view: string;

  public static new(label, icon, view): MenuEntry{
    let result : MenuEntry= new MenuEntry();
    result.icon = icon;
    result.label = label;
    result.view = view;
    return result;
  }
}