import {Entity, PrimaryColumn, OneToMany, JoinTable} from "typeorm";
import {Command} from "./Command"
import {Application} from "./Application"
import {ViewCommandType} from "./ViewCommandType"

@Entity()
export class View {

  @PrimaryColumn()
  name: string;

  
  @OneToMany(type => ViewCommandType, viewCommandType => viewCommandType.view)
  viewCommandTypes: ViewCommandType[] = [];

  commands: Command[] = [];
  applications: Application[] = [];
}
