import {Entity, PrimaryColumn, OneToMany} from "typeorm";
import {ViewCommandType} from "./ViewCommandType"
import {Command} from "./Command"

@Entity()
export class CommandType {

  @PrimaryColumn()
  name: string;

  
  @OneToMany(type => ViewCommandType, viewCommandType => viewCommandType.commandType)
  viewCommandTypes: ViewCommandType[] = [];
}
