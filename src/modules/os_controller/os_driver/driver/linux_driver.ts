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
import {CommandRepository} from "../../model/repository/CommandRepository"

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

  private consoleError(error, stdout, stderr){
    this.init();

    if(error){
      logger.error(error, stderr);
    }
  }

  public async exec(cmd: number) {
    let connectionMere = await connectionManager.session();
    connectionMere.entityManager.transaction(transaction=>{
      CommandRepository.findOne(transaction, cmd).then( command=>{
        if(command){
          exec(command.shell, this.consoleError.bind(this));
        }
      });
    });
  }

  public getRunList(): {[id:string]:ApplicationDto} {
    return this.oldRun;
  }

  public getFocus(): ApplicationDto {
    return this.focus?this.focus:this.createGost();
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

  private createGost(): ApplicationDto{
      let gost :ApplicationDto = new ApplicationDto();
      gost.addWindow({"title":"Empty run list", "id":"Desktop"})
      gost.focusId = "Desktop"; 
      gost.name = "Empty list";
      gost.id="GOST.GOST"
      return gost;
  }

  private async run(error, stdout, stderr) {
    let newRun: {[id:string]:ApplicationDto} ;

    if(stdout===""){
      newRun= {};
    }else{
      newRun= this.readApplication(stdout);
    }
    
    newRun["GOST.GOST"] = this.createGost();

    
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
    return Promise.all(promise).catch(error=>{
      logger.error(error);
      this.liberateTokenError();
    });;
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
            app = openedApplications
              .filter(opened=>opened.id==applicationId)[0];
            this.oldRun[applicationId] = app;
          }
          return new Promise(resolve=>resolve(app));
        }).catch(error=>{
              logger.error(error);
              this.liberateTokenError();
            }));
      })
      Promise.all(appromise.filter(prom=>prom))
        .then(applicationsDto=>
          this.father.onOpens(applicationsDto.filter(prom=>prom)))
        .catch(error=>{
          logger.error(error);
          this.liberateTokenError();
        });
    });
  }

  private liberateTokenError(){
    this.oldRun = {};
    this.liberateToken();
  }
  private liberateToken(){
    this.token--;
    if(this.token<=0){
      this.token=0;
    }
  }

  public focusHandler(error, stdout, stderr){
    let focus;
    let focusId;
    
    if (stdout!=="") {
      let parameters = stdout.split('\n')[0].split(' ');
      if (parameters.length<2) { return; }
      focus = this.oldRun[parameters[1].toUpperCase()];
      focusId = parameters[0];
    }
    
    if(!focus || !focusId) {
      focus = this.createGost();
      focusId = focus.windows[Object.keys(focus.windows)[0]].id;
    }

    if(focus && focus.windows[focusId] && (!this.focus || (focus.id != this.focus.id || focusId != this.focus.focusId))){
      this.focus = focus;
      this.focus.focusId = focusId;
      if(this.focus){
        this.father.onFocusChange(this.focus);
      }
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
    }).catch(error=>{
      logger.error(error);
      this.liberateTokenError();
    });
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