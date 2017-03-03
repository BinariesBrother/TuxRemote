import { LinuxDriver } from './os_driver/driver/linux_driver';
import { OsDriver } from './os_driver/interface/os_driver';
import { OsInterface } from './os_driver/interface/os_interface';


export class osFactory{

  public static getOsDriver(father: OsInterface): OsDriver{
    let result : OsDriver= new LinuxDriver();
    result.setFather(father);
    return result;
  }
}