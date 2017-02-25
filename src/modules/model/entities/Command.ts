import {Entity, TableInheritance, Index, Column, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {View} from "./View";
import {Application} from "./Application";
import {CommandType} from "./CommandType";


@Entity()
@Index("index_item_sequence", ['name', 'view'], { unique: true })
export class Command {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ nullable: true })
  shell: string;

  @ManyToOne(type => View, view => view.commands)
  view: View;

  @ManyToOne(type => Application, application => application.commands)
  application: Application;

  @ManyToOne(type => CommandType, commandType => commandType.commands)
  commandType: CommandType;

}
