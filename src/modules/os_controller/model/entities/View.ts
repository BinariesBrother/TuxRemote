import {Entity, PrimaryColumn, OneToMany, JoinTable, ManyToOne, Column} from "typeorm";
import {Command} from "./Command"
import {Application} from "./Application"
import {ViewCommandType} from "./ViewCommandType"

@Entity()
export class View {

  @PrimaryColumn()
  name: string;

  @Column({ nullable: true })
  module: string;


  @OneToMany(type => ViewCommandType, viewCommandType => viewCommandType.view)
  viewCommandTypes: ViewCommandType[] = [];

  @OneToMany(type => Application, application => application.view)
  applications: Application[] = [];
}
