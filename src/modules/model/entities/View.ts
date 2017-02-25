import {Entity, PrimaryColumn, ManyToMany, JoinTable} from "typeorm";
import {Command} from "./Command"
import {Application} from "./Application"
import {CommandType} from "./CommandType"

@Entity()
export class View {

  @PrimaryColumn()
  name: string;

  @ManyToMany(type => CommandType, commandType => commandType.views, {  // note: we will create "albums" property in the Photo class below
    cascadeInsert: true, // allow to insert a new photo on album save
    cascadeUpdate: true // allow to update a photo on album save
  })
  @JoinTable()
  commandTypes: CommandType[] = [];

  commands: Command[] = [];
  applications: Application[] = [];
}
