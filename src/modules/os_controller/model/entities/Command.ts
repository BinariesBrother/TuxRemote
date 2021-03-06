import {Entity, TableInheritance, Index, Column, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {View} from "./View";
import {Application} from "./Application";
import {CommandType} from "./CommandType";
import {ViewCommandType} from "./ViewCommandType";


@Entity()
@Index("index_item_sequence", ['name', 'application'], { unique: true })
export class Command {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ nullable: true })
  shell: string;

  @ManyToOne(type => Application, application => application.commands)
  application: Application;

  @OneToMany(type => ViewCommandType, viewCommandType => viewCommandType.commandType)
  viewCommandTypes: ViewCommandType[] = [];


  @OneToMany(type => Application, application => application.commands)
  applications: Application[];

}
