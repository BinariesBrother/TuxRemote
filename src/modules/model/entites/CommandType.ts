import {Entity, PrimaryColumn, ManyToMany} from "typeorm";
import {View} from "./View"

@Entity()
export class CommandType{

    @PrimaryColumn()
    name: string;

    @ManyToMany(type => View, view => view.commandTypes, {  // note: we will create "albums" property in the Photo class below
        cascadeInsert: true, // allow to insert a new photo on album save
        cascadeUpdate: true // allow to update a photo on album save
    })
    views: View[] = [];

}
