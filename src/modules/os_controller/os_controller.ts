import { OsDriver } from './os_driver/interface/os_driver';
import { OsInterface } from './os_driver/interface/os_interface';
import { MousePosition } from './os_driver/mouse_position';
import { osFactory } from './os_factory';
import {exec} from 'child_process';
import {Application} from '../model/entities/Application';
import {ApplicationDto} from '../model/dto/ApplicationDto';
import {ApplicationRepository} from '../model/repository/ApplicationRepository';

import {io} from "../server/server";

export class OsController implements OsInterface{

  oldRun: ApplicationDto[];
  oldFocus: any[];
  interval: Number;
  osDriver: OsDriver;
  static osController: OsController

  private constructor(){
    this.osDriver = osFactory.getOsDriver(this);
  }

  public static getInstance(){
    if(!this.osController){
      this.osController = new OsController();
    }
    return this.osController;
  }  

  public exec(cmd){
    this.osDriver.exec(cmd);
  }

  public getRunList(): {[id:string]:ApplicationDto}{
    return this.osDriver.getRunList();
  }

  public getFocus() {
    return this.osDriver.getFocus();
  }

  public getSound() {
    return this.osDriver.getSound();
  }

  public setFocus(pid) {
    this.osDriver.setFocus(pid);
  }

  public setSound(volume) {
    this.osDriver.setSound(volume);
  }

  public kill(pid) {
    this.osDriver.kill(pid);
  }

  public open(application:ApplicationDto) {
    this.osDriver.open(application.open);
  }

  public onClose(application: ApplicationDto){
    io.emit('',application);
  }


  public onOpens(applications: ApplicationDto[]): Promise<any>{
    if(applications.length>0){
      console.log("open ", applications.map(app=>({name:app.name, id:app.id})), );
    }
    return new Promise(resolve=>resolve());
  }

  public onChanges(applications: ApplicationDto[], diff:any){
    console.log("change ", applications, diff);
  }

  public onCloses(applications: String[]){
    console.log("close ", applications)
  }

  public onOpen(application: ApplicationDto){
  }

  public onChange(application: ApplicationDto){
  }


  public moveMouse(position: MousePosition){

  }
}

OsController.getInstance();