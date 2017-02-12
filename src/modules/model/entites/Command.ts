import {Entity, Index, Column, ManyToOne} from "typeorm";
import {View} from "./View"
import {Application} from "./Application"

@Entity()
@Index("index_item_sequence", ['name', 'view'], { unique: true })
export class Command{


    @Column()
    name: string;

    @Column()
    icon: string;

    @ManyToOne(type => View, view => view.commands)
    view: View;

    @ManyToOne(type => Application, application => application.commands)
    application: Application;

}
