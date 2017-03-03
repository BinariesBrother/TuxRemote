import {CommandType} from "../entities/CommandType";
import {ViewCommandType} from "../entities/ViewCommandType";
import {CommandDto} from "./CommandDto";
import {JsonProperty} from 'json-typescript-mapper'; 

export class CommandTypeDto{
  
  @JsonProperty("name")
  name: string;

  @JsonProperty({clazz: CommandDto, name:"command"})
  command: CommandDto;
  
  public constructor(){
    this.name = void 0;
    this.command = void 0;
  }

  public static fromViewCommandType(viewCommandType: ViewCommandType): CommandTypeDto{
    if(!viewCommandType){
      return undefined;
    }
    let result: CommandTypeDto = new CommandTypeDto();
    result.name = viewCommandType.commandType? viewCommandType.commandType.name: void 0;
    result.command = viewCommandType.command? CommandDto.fromCommand(viewCommandType.command): void 0;
    return result;
  } 
}