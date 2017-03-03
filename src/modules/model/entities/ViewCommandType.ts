import {Entity, PrimaryGeneratedColumn, ManyToOne,Index} from "typeorm";
import {View} from "./View"
import {CommandType} from "./CommandType"
import {Command} from "./Command"

@Entity()
@Index("viewCommandTypeUnique", ['view', 'commandType'], { unique: true })
export class ViewCommandType {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => View, view => view.viewCommandTypes)
  view: View;

  @ManyToOne(type => CommandType, commandType => commandType.viewCommandTypes)
  commandType: CommandType;

  @ManyToOne(type => Command, command => command.viewCommandTypes)
  command: Command;

}
