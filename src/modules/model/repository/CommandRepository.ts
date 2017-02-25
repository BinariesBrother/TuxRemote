import {Command} from "../entities/Command";
import * as connectionManager from "./Connection";
import {ApplicationRepository} from "./ApplicationRepository";
import {EntityManager} from "typeorm";

export class CommandRepository {

  public static async findAll(transaction: EntityManager): Promise<Command[]> {
    return transaction.getRepository(Command)
      .find();
  }

  /**
  * récupère les commandes liées à une application
  * "select * from commands where applicationId = :applicationId "
  */
  public static async findByApplication(transaction: EntityManager, applicationId: String): Promise<Command[]> {
    return transaction.getRepository(Command)
      .createQueryBuilder("command")
      .leftJoin("command.application", "application")
      .where("application.id LIKE :applicationId", { applicationId: applicationId })
      .getMany();
  }

  /**
  * récupère la commande de nom commandName liée à l'application applicationId
  * "select * from commands where commandName = :commandName AND applicationId = :applicationId"
  */
  public static async findOneByCommandNameAndApplication(transaction: EntityManager, 
                      commandName: String, applicationId: String): Promise<Command> {
     return transaction.getRepository(Command)
      .createQueryBuilder("command")
      .leftJoin("command.application", "application")
      .where("application.id LIKE :applicationId and command.name LIKE :commandName"
      , { applicationId: applicationId, commandName: commandName })
      .getOne();
  }

  /**
  * insert une commande
  */
  public static async save(transaction: EntityManager, commande: Command): Promise<Command> {
    return transaction
      .persist(commande);
  }

  public static init(transaction: EntityManager, commands) : Promise<Object>{
    let promiseAll : Promise<Object>[] = [];
    commands.forEach(command => {
      let com = new Command();
      com.name = command.name;
      com.icon = command.icon;
      com.shell = command.shell;
      promiseAll.push(ApplicationRepository.findOne(transaction, command.applicationId).then(app => {
        console.log(app.name, command.name);
        com.application = app;
        return CommandRepository.save(transaction, com);
      }));
    });
    return Promise.all(promiseAll);
  }

}
