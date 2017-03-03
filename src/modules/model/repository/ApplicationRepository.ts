import {Application} from "../entities/Application";
import * as connectionManager from "./Connection";
import {ViewRepository} from "./ViewRepository";
import {EntityManager} from "typeorm";

export class ApplicationRepository {

  public static async findAll(transaction: EntityManager): Promise<Application[]> {
    return transaction.getRepository(Application)
        .createQueryBuilder("application")
        .leftJoinAndSelect("application.open", "open")
        .leftJoinAndSelect("application.commands", "command")
        .leftJoinAndSelect("application.view", "view")
        .leftJoinAndSelect("view.viewCommandTypes", "viewCommandType")
        .leftJoinAndSelect("viewCommandType.commandType", "commandType")
        .getMany();
  }

  public static async findAllById(transaction: EntityManager, id:String): Promise<Application> {
      return transaction.getRepository(Application)
        .createQueryBuilder("application")
        .leftJoinAndSelect("application.open", "open")
        .leftJoinAndSelect("application.commands", "command")
        .leftJoinAndSelect("application.view", "view")
        .leftJoinAndSelect("view.viewCommandTypes", "viewCommandType")
        .leftJoinAndSelect("viewCommandType.commandType", "commandType")
        .where("application.id = :id",{id:id})
        .getOne();
  }
  

  public static async findOne(transaction: EntityManager, applicationId: String): Promise<Application> {
    return transaction.getRepository(Application)
      .createQueryBuilder("application")
      .where("application.id = :applicationId"
      , { applicationId: applicationId }) 
      .getOne();
  }


  public static async save(transaction: EntityManager, application: Application): Promise<Application> {
    application.id = application.id.toUpperCase();
    return transaction
      .persist(application);
  }

  public static init(transaction: EntityManager, applications) : Promise<Object>{
    let promiseAll : Promise<Object>[] = [];
    applications.forEach(application => {
      let app = new Application();
      app.id = application.id;
      app.name = application.name;
      app.icon = application.icon;
      promiseAll.push(ViewRepository.findOne(transaction, application.viewName).then(view=>{
        app.view = view;
        return ApplicationRepository.save(transaction, app);
      }));
    });
    return Promise.all(promiseAll);
  }

}
