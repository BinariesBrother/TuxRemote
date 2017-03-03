import {WindowDto} from "./WindowDto";
import { Command } from './../entities/Command';
import {ViewDto} from "./ViewDto";
import {CommandDto} from "./CommandDto";
import {Application} from "../entities/Application";
import {JsonProperty} from 'json-typescript-mapper'; 

export class ApplicationDto {
  @JsonProperty({clazz: WindowDto, name: "windows"})
  windows: {[id:string]:WindowDto} = {};

  @JsonProperty("id")
  id: string;

  @JsonProperty("focusId")
  focusId: string;

  @JsonProperty("name")
  name: string;

  @JsonProperty("icon")
  icon: string;

  @JsonProperty({clazz: ViewDto, name:"view"})
  view: ViewDto;

  @JsonProperty({clazz: CommandDto, name:"open"})
  open: CommandDto;

  @JsonProperty({clazz: CommandDto, name:"commands"})
  commands: CommandDto[];

  public constructor(){
    this.id = void 0;
    this.name = void 0;
    this.icon = void 0;
    this.view = void 0;
    this.open = void 0;
    this.commands = [];
  }

  public static fromApplication(application: Application) : ApplicationDto{
    if(!application){
      return undefined;
    }
    let result : ApplicationDto = new ApplicationDto();
    result.id = application.id?application.id:void 0;
    result.name = application.name?application.name:void 0;
    result.icon = application.icon?application.icon:void 0;
    result.view = application.view?ViewDto.fromView(application.view):void 0;
    result.open = CommandDto.fromCommand(application.open);
    if(application.commands){
      application.commands.forEach(command=>
        result.commands.push(CommandDto.fromCommand(command)));
    }
    return result;
  }
  
  public static fromApplicationJson(application): ApplicationDto{
    let result : ApplicationDto = new ApplicationDto();
    result.id = application.id?application.id:void 0;
    result.name = application.name?application.name:void 0;
    return result;
  }

  public static fromApplications(applications: Application[]) : ApplicationDto[]{
    return applications.map(app=>ApplicationDto.fromApplication(app));
  }

  public addWindow(app: any){
    console.log("newWindowDto", app.title)
    let result : WindowDto = new WindowDto();
    console.log("createWindowDto", app.title)
    result.title = app.title;
    result.id = app.windowId;
    this.windows[app.windowId] = result;
  }

  public merge(application: ApplicationDto):{[id:string]: WindowDto[]}{
    let result :{[id:string]: WindowDto[]} = {opened:[], closed:[], changed:[]};
    Object.keys(application.windows).forEach(windowId=>{
      let window = application.windows[windowId];
      if(this.windows[window.id] && this.windows[window.id].title!==window.title){
        result["changed"].push(window);
        this.windows[window.id].title = window.title;
      } else if(!this.windows[window.id]){
        result["opened"].push(window);
        this.addWindow(window);
      }
    });
    Object.keys(this.windows).forEach(windowId=>{
      let window = this.windows[windowId];
      if(!application.windows[window.id]){
        result["closed"].push(window);
        this.windows[window.id] = undefined;
      }
    });

    return result;
  }

  public static mergeApplciations(origine: {[id:string]:ApplicationDto}, compare: {[id:string]:ApplicationDto})
    :{[id:string]: {[id:string]: WindowDto[]}}{
    let result :any = {};
    Object.keys(compare).forEach(applicationId=>{
      if(origine[applicationId]){
        let temp = origine[applicationId].merge(compare[applicationId]);
        let diff : {[id:string]: WindowDto[]}= {};
        result[applicationId]=temp["opened"];
        result[applicationId]=temp["closed"];
        result[applicationId]=temp["changed"];
      }
    });
    return result;
  }

}
