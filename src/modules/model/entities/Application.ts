import {Entity, Column, PrimaryColumn, ManyToOne} from "typeorm";
import {View} from "./View"
import {Command} from "./Command"

@Entity()
export class Application {

  @PrimaryColumn()
  id: string;

  @Column()
  open: Command;

  @Column()
  name: string;

  @Column({ nullable: true })
  icon: string;

  @ManyToOne(type => View, view => view.applications)
  view: View;

  commands: Command[] = [];

}
