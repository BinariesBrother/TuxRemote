import { exec } from 'child_process';
import { ApplicationRepository } from './../../../model/repository/ApplicationRepository';
import { Application } from './../../../model/entities/Application';
import { OsController } from './../../os_controller';
import { OsInterface } from './../interface/os_interface';
import { OsDriver } from './../interface/os_driver';
import { MousePosition } from './../mouse_position';
import { CommandDto } from './../../../model/dto/CommandDto';
import { ApplicationDto } from './../../../model/dto/ApplicationDto';
import * as connectionManager from "../../../model/repository/Connection";

export class LinuxDriver implements OsDriver {
  father: OsInterface;
  oldRun : {[id:string]:ApplicationDto}={};
  onRun : boolean = false;
  token: number = 0;

  public constructor(){
    this.init();
  }

  public setFather(OsInterface: OsInterface){
    this.father = OsInterface;
  }

  public exec(cmd) {
    
  }

  public getRunList(): {[id:string]:ApplicationDto} {
    return this.oldRun;
  }

  public getFocus(): ApplicationDto {
    return null;    
  }

  public getSound(): any {
    
  }

  public setFocus(pid: string) {
    
  }

  public setSound(volume:number) {
    
  }

  public kill(pid: string) {
    
  }

  public open(cmd: CommandDto) {
    
  }


  public moveMouse(position: MousePosition){

  }



  private readApplication(stdOut): {[id:string]:ApplicationDto}{
    let result : {[id:string]:ApplicationDto}={};
    let apps = stdOut.split("\n");
    apps.pop();
    for (let i = 0; i < (apps.length); i = (i + 1)) {
      let str = apps[i].replace(/"/g, '\\"').replace(/\(\(/g, '"');
      let app = JSON.parse(str);
      app.id = app.id.toUpperCase();
      if(!result[app.id]){
        result[app.id] = ApplicationDto.fromApplicationJson(app);
      }
      result[app.id].addWindow(app);
    }
    return result;
  }

  private async run(error, stdout, stderr) {
    let connectionMere = await connectionManager.session();
    if (stdout==="") { return; }
    let newRun: {[id:string]:ApplicationDto} = this.readApplication(stdout);
    let diff = ApplicationDto.mergeApplciations(this.oldRun, newRun);

    let openedApplications : ApplicationDto[] = Object.keys(newRun).map(id=>{
      return this.oldRun[id]?undefined:newRun[id];
    }).filter(nonNull=>nonNull);
    
    let killedApplications : ApplicationDto[] = Object.keys(this.oldRun).map(id=>{
      return newRun[id]?undefined:newRun[id];
    }).filter(nonNull=>nonNull);
    
    let changedApplications : ApplicationDto[] = Object.keys(diff)
      .map(id=>this.oldRun[id]);

    if(Object.keys(diff).length>0){
          console.log("closed",killedApplications);
    }

    let promise:Promise<any>[]=[];
    if(killedApplications.length>0){
      promise.push(this.killedApplications(killedApplications));
    }
    if(changedApplications.length>0){
      promise.push(this.changedApplications(changedApplications, diff));
    }
    if(openedApplications.length>0){
      promise.push(this.openedApplications(openedApplications));
    }
    Promise.all(promise).then(result=>{
      
      this.liberateToken();
    }).catch(error=>console.log(error));
  }
  public async killedApplications(killedApplications: ApplicationDto[]){
    let closes = killedApplications.map(app=>app.id);
    this.father.onCloses(closes);
    closes.forEach(id=>delete this.oldRun[id]);
  }

  public async changedApplications(changedApplications: ApplicationDto[], diff:any){
    this.father.onChanges(changedApplications, diff);
  }

  public async openedApplications(openedApplications: ApplicationDto[]): Promise<any>{
    let ids: String[] = openedApplications.map(app=>app.id);
    let run :{[id:string]:ApplicationDto}= {};
    openedApplications.forEach(app=>run[app.id]=app);
    let connectionMere = await connectionManager.session();
    connectionMere.entityManager.transaction(transaction=>{
      let appromise=[];
      ids.forEach(applicationId=>{
        appromise.push(ApplicationRepository.findAllById(transaction, applicationId).then(application=>{
          let app: ApplicationDto;
          if(application){
            app = ApplicationDto.fromApplication(application);
            app.windows = run[app.id].windows;
            this.oldRun[app.id]=app;
          }
          return new Promise(resolve=>resolve(app));
        }).catch(error=>console.log(error)));
      })
      Promise.all(appromise.filter(prom=>prom))
        .then(applicationsDto=>
          this.father.onOpens(applicationsDto.filter(prom=>prom)))
        .catch(error=>console.log(error));
    });
  }

  private liberateToken(){
    this.token--;
    if(this.token<=0){
      this.token=0;
    }
  }

  private runIntervalCallback() {
    exec('bash '+__dirname+'/linux_commandes/run', this.run.bind(this));
  }

  private focusIntervalCallback() {
    //exec('bash '+__dirname+'/linux_commandes/focus', this.focus.bind(this));
  }

  private soundIntervalCallback() {
    //exec('bash '+__dirname+'/linux_commandes/sound', this.sound.bind(this));
  }

  private handler = function() {
    if(this.token==0){
      this.token=1;
      this.runIntervalCallback();
      //this.focusIntervalCallback();
      //this.soundIntervalCallback();
    }
  }

  private init= function(){
    this.interval=setInterval(this.handler.bind(this), 200);
  }

}
/*
private function sound = function (error, stdout, stderr) {
  let new_sound = stdout;
  if (this.oldSound !== undefined) {
    if (this.oldSound !== new_sound) {
      this.oldSound = new_sound;
      this.hashCallBack.sound.call(this,this.oldSound);
    }
  }else{
    this.oldSound=new_sound;
  }
};


*/