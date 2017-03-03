import {Entity, Column, PrimaryColumn, ManyToOne, OneToMany} from "typeorm";
import {View} from "./View"
import {Command} from "./Command"

@Entity()
export class Application {

  @PrimaryColumn()
  id: string;

  @ManyToOne(type => Command, Command => Command.applications)
  open: Command;

  @Column()
  name: string;

  @Column({ nullable: true })
  icon: string;

  @ManyToOne(type => View, view => view.applications)
  view: View;

  @OneToMany(type => Command, command => command.application)
  commands: Command[] = [];

}
