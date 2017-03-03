import { OsInterface } from './os_interface';
import { MousePosition } from './../mouse_position';
import { CommandDto } from './../../../model/dto/CommandDto';
import { ApplicationDto } from './../../../model/dto/ApplicationDto';


export interface OsDriver{

  setFather( osControler: OsInterface );

  exec(cmd);

  getRunList(): {[id:string]:ApplicationDto};

  getFocus(): ApplicationDto;

  getSound(): any;

  setFocus(pid: string);

  setSound(volume:number);

  kill(pid: string);

  open(cmd: CommandDto);

  moveMouse(position: MousePosition);
}