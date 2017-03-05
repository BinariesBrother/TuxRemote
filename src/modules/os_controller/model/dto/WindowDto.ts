import { JsonProperty } from 'json-typescript-mapper';

export class WindowDto {

  @JsonProperty("title")
  title: string;

  @JsonProperty("execId")
  id: string;
  

  public constructor(){}
}