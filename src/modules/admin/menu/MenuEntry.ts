import {JsonProperty} from 'json-typescript-mapper';

export class MenuEntry{

  @JsonProperty("label")
  label: string;

  @JsonProperty("icon")
  icon: string;

  @JsonProperty("view")
  view: string;
}