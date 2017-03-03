import { CommandTypeDto } from './CommandTypeDto';
import { CommandType } from './../entities/CommandType';
import {View} from "../entities/View";
import {JsonProperty} from 'json-typescript-mapper'; 

export class ViewDto {
  
  @JsonProperty("name")
  name: string;
  

  @JsonProperty({clazz: CommandTypeDto, name:"commandesTypes"})
  commandesTypes: CommandTypeDto[];
  
  public constructor(){
    this.name = void 0;
    this.commandesTypes = [];
  }

  public static fromView(view: View): ViewDto{
      if(!view){
        return undefined;
      }
      let result : ViewDto = new ViewDto;
      result.name = view.name;
      if(view.viewCommandTypes){
              view.viewCommandTypes.forEach(viewCommandType=>
                result.commandesTypes.push(CommandTypeDto.fromViewCommandType(viewCommandType))
        );
      }
      return result;
  }
}