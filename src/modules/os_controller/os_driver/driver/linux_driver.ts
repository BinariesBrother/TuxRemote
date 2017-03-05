import { exec } from 'child_process';
import { ApplicationRepository } from './../../model/repository/ApplicationRepository';
import { Application } from './../../model/entities/Application';
import { OsController } from './../../os_controller';
import { OsInterface } from './../interface/os_interface';
import { OsDriver } from './../interface/os_driver';
import { MousePosition } from './../mouse_position';
import { CommandDto } from './../../model/dto/CommandDto';
import { ApplicationDto } from './../../model/dto/ApplicationDto';
import * as connectionManager from "../../model/repository/Connection";
import * as logger from 'node-yolog';

export class LinuxDriver implements OsDriver {
  father: OsInterface;
  oldRun : {[id:string]:ApplicationDto}={};
  onRun : boolean = false;
  token: number = 0;
  focus: ApplicationDto;
  sound: number;

  public constructor(){
    this.init();

  }

  public setFather(OsInterface: OsInterface){
    this.father = OsInterface;
  }

  public exec(cmd: CommandDto) {
    exec(cmd.shell);
  }

  public getRunList(): {[id:string]:ApplicationDto} {
    return this.oldRun;
  }

  public getFocus(): ApplicationDto {
    return this.focus;
  }

  public getSound(): any {
    return this.sound;
  }

  public setFocus(pid: string) {
    exec("wmctrl -i -R "+pid);
  }

  public setSound(volume:number) {
    exec("amixer -D pulse set Master "+volume+"%");
  }

  public kill(pid: string) {
    exec("wmctrl -i -c "+pid);
  }

  public open(cmd: CommandDto) {
    exec(cmd.shell);
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
      if(app.id){
        if(!result[app.id]){
          result[app.id] = ApplicationDto.fromApplicationJson(app);
        }
        result[app.id].addWindow(app);
      }
    }
    return result;
  }

  private async run(error, stdout, stderr) {
    if (stdout==="") { return; }
    let newRun: {[id:string]:ApplicationDto} = this.readApplication(stdout);
    let diff = ApplicationDto.mergeApplciations(this.oldRun, newRun);

    let openedApplications : ApplicationDto[] = Object.keys(newRun).map(id=>{
      return this.oldRun[id]?undefined:newRun[id];
    }).filter(nonNull=>nonNull);

    let killedApplications : ApplicationDto[] = Object.keys(this.oldRun).map(id=>{
      return newRun[id]?undefined:this.oldRun[id];
    }).filter(nonNull=>nonNull);

    let changedApplications : ApplicationDto[] = Object.keys(diff)
      .map(id=>this.oldRun[id]);

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
    return Promise.all(promise);
  }
  private async killedApplications(killedApplications: ApplicationDto[]){
    let closes = killedApplications.map(app=>app.id);
    this.father.onCloses(closes);
    closes.forEach(id=>delete this.oldRun[id]);
  }

  private async changedApplications(changedApplications: ApplicationDto[], diff:any){
    this.father.onChanges(changedApplications, diff);
  }

  private async openedApplications(openedApplications: ApplicationDto[]): Promise<any>{
    let ids: string[] = openedApplications.map(app=>app.id);
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
          }else{
            this.oldRun[applicationId] = openedApplications.filter(opened=>opened.id==applicationId)[0];
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

  public focusHandler(error, stdout, stderr){
    if (stdout==="") { return; }
    let parameters = stdout.split('\n')[0].split(' ');
    if (parameters.length<2) { return; }
    let focus = this.oldRun[parameters[1].toUpperCase()];
    let focusId = parameters[0];
    if(focus && (!this.focus || (focus.id != this.focus.id || focusId != this.focus.focusId))){
      this.focus = focus;
      this.focus.focusId = focusId;
      this.father.onFocusChange(this.focus);
    }

  }

  private soundHandler(error, stdout, stderr){
    if (stdout==="") { return; }
    let sound = parseInt(stdout);
    if(this.sound !== sound){
      this.sound = sound;
      this.father.onSoundChange(this.sound);
    }

  }

  private firstElementBind(error, stdout, stderr){
    this.run(error, stdout, stderr).then(result=>{
      this.focusIntervalCallback();
      this.soundIntervalCallback();
      this.liberateToken();
    })
  }

  private runIntervalCallback() {
    exec('bash '+__dirname+'/linux_commandes/run', this.firstElementBind.bind(this));
  }

  private focusIntervalCallback() {
    exec('bash '+__dirname+'/linux_commandes/focus', this.focusHandler.bind(this));
  }

  private soundIntervalCallback() {
    exec('bash '+__dirname+'/linux_commandes/sound', this.soundHandler.bind(this));
  }

  private handler = function() {
    if(this.token==0){
      this.token=1;
      this.runIntervalCallback();
    }
  }

  private init= function(){
    this.interval=setInterval(this.handler.bind(this), 200);
  }

}