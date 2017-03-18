import { CommandTypeDto } from './CommandTypeDto';
import { CommandType } from './../entities/CommandType';
import {View} from "../entities/View";
import {JsonProperty} from 'json-typescript-mapper';

export class ViewDto {

  @JsonProperty("name")
  name: string;

  @JsonProperty("module")
  module: string;


  @JsonProperty({clazz: CommandTypeDto, name:"commandesTypes"})
  commandesTypes: {[id:string]:CommandTypeDto} = {};

  public constructor(){
    this.name = void 0;
    this.module = 'core';
    this.commandesTypes = {};
  }

  public static fromView(view: View): ViewDto{
      if(!view){
        return undefined;
      }
      let result : ViewDto = new ViewDto;
      result.name = view.name;
      if (view.module) {
        result.module = view.module;
      }
      if(view.viewCommandTypes){
        view.viewCommandTypes.forEach(viewCommandType =>
          result.commandesTypes[viewCommandType.id] = CommandTypeDto.fromViewCommandType(viewCommandType)
        );
      }
      return result;
  }
}