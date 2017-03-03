import {Command} from "../entities/Command";
import {JsonProperty} from 'json-typescript-mapper'; 

export class CommandDto {

  @JsonProperty("id")
  id: number;

  @JsonProperty("name")
  name: string;

  @JsonProperty("icon")
  icon: string;

  @JsonProperty("shell")
  shell: string;

  public constructor(){
    this.id = void 0;
    this.name = void 0;
    this.icon = void 0;
    this.shell = void 0;
  }

  public static fromCommand(command: Command): CommandDto{
    if(!command){
      return undefined;
    }
    let result = new CommandDto();
    result.id = command.id? command.id: void 0;
    result.name = command.name? command.name: void 0;
    result.icon = command.icon? command.icon: void 0;
    result.shell = command.shell? command.shell: void 0;
    return result;
  }

}