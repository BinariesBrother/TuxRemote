import { OsDriver } from './os_driver/interface/os_driver';
import { OsInterface } from './os_driver/interface/os_interface';
import { MousePosition } from './os_driver/mouse_position';
import { osFactory } from './os_factory';
import {exec} from 'child_process';
import {init} from './model/model'
import {Application} from './model/entities/Application';
import {ApplicationDto} from './model/dto/ApplicationDto';
import {ApplicationRepository} from './model/repository/ApplicationRepository';

import {invoke, defineHook, defineHooks, hook} from "../hooks/hooks";

import {io} from "../server/server";


export class OsController implements OsInterface{

  oldRun: ApplicationDto[];
  oldFocus: any[];
  interval: Number;
  osDriver: OsDriver;
  static osController: OsController
  events: string[];

  private constructor(){
    this.initbd().then(result=>{
      this.osDriver = osFactory.getOsDriver(this);
    });
    this.events = defineHooks([
      "tuxeRemote/osController/exec",
      "tuxeRemote/osController/getRunList",
      "tuxeRemote/osController/getFocus",
      "tuxeRemote/osController/getSound",
      "tuxeRemote/osController/setFocus",
      "tuxeRemote/osController/setSound",
      "tuxeRemote/osController/kill",
      "tuxeRemote/osController/open",
      "tuxeRemote/osController/moveMouse"
    ]);
  }

  public static getInstance(){
    if(!this.osController){
      this.osController = new OsController();
    }
    return this.osController;
  }  

  private initbd(): Promise<any>{
    return init();
  }
  
  /**
   * define hook annotations
   */
  @hook("tuxRemote/socket/eventListener", () => OsController.getInstance())
  defineEventListener() { return this.events;}

  /**
   * ask an command to exec
   * @param args : string command
   */
  @hook("tuxeRemote/osController/exec")
  public exec(socket: any, args: any[]){
    this.osDriver.exec(args[0]);
  }

  /**
   * asking the runlist
   * @param args: empty
   */
  @hook("tuxeRemote/osController/getRunList")
  public getRunList(socket: any, args: any[]){
    socket.emit('tuxeremote/os_controller/setRunList',this.osDriver.getRunList());
  }

  /**
   * asking focus
   * @param args focusId
   */
  @hook("tuxeRemote/osController/getFocus")
  public getFocus(socket: any, args: any[]) {
    this.onFocusChangeLowLevel(socket, this.osDriver.getFocus() );
  }

  /**
   * asking sound
   * @param args emmpty
   */
  @hook("tuxeRemote/osController/getSound")
  public getSound(socket: any, args: any[]) {
    this.onSoundChangeLowLevel(socket, this.osDriver.getSound() );
  }

  /**
   * set the focus on window
   * @param args windowId
   */
  @hook("tuxeRemote/osController/setFocus")
  public setFocus(socket: any, args: any[]) {
    this.osDriver.setFocus(args[0]);
  }

  /**
   * set the sound level
   * @param args percent of the sound asking
   */
  @hook("tuxeRemote/osController/setSound")
  public setSound(socket: any, args: any[]) {
    this.osDriver.setSound(args[0]);
  }

  /**
   * kill an application by applicationId
   * @param args applicationId to killed
   */
  @hook("tuxeRemote/osController/kill")
  public kill(socket: any, args: any[]) {
    this.osDriver.kill(args[0]);
  }

  /**
   * opening an application by command
   * @param args string command
   */
  @hook("tuxeRemote/osController/open")
  public open(socket: any, args: any[]) {
    this.osDriver.open(args[0]);
  }

  public onOpens(applications: ApplicationDto[]): Promise<any>{
    if(applications.length>0){
      io.emit('tuxeremote/osController/focusChange',applications);
      console.log("OPEN ", applications.map(app=>({name:app.name, id:app.id})), );
    }
    return new Promise(resolve=>resolve());
  }

  public onChanges(applications: ApplicationDto[], diff:any){
    io.emit('tuxeremote/osController/applicationsChanged',diff);
    console.log("change ", applications, diff);
  }

  public onCloses(applications: String[]){
    io.emit('tuxeremote/osController/applicationsClosed',applications);
    console.log("close ", applications)
  }


  /**
   * moving mouse
   * @param args {x:X, y:Y}
   */
  @hook("tuxeRemote/osController/moveMouse")
  public moveMouse(socket: any, args: any[]){
    let mouse = new MousePosition();
    mouse.x = args[0].x;
    mouse.y = args[0].y;
    //TODO WEBSOCKET MOUSE
    this.osDriver.moveMouse(mouse);
  }


  public onFocusChange(application: ApplicationDto){
    this.onFocusChangeLowLevel(io, application);
  }

  private onFocusChangeLowLevel(socket: any, application: ApplicationDto){
    socket.emit('tuxeremote/osController/focusChange',{id:application.id, window:application.focusId});
    console.log("FOCUS app:",application.name, " title:", application.windows[application.focusId].title)
  }

  public onSoundChange(sound: number){
    this.onSoundChangeLowLevel(io, sound);
  }

  private onSoundChangeLowLevel(socket: any, sound: number){
    socket.emit('tuxeremote/osController/soundChange',sound);
    console.log("SOUND ",sound, "%");
  }

}

OsController.getInstance();