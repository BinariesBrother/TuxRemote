import {CommandType} from "../entities/CommandType";
import * as connectionManager from "./Connection";
import {EntityManager} from "typeorm";


export class CommandTypeRepository {

  public static async findAll(transaction: EntityManager): Promise<CommandType[]> {
    return transaction.getRepository(CommandType)
      .find();
  }

  public static async findOne(transaction: EntityManager, commandName: String): Promise<CommandType> {
    return transaction.getRepository(CommandType)
      .createQueryBuilder("commandType")
      .where("commandType.name LIKE :commandName"
      , { commandName: commandName })
      .getOne();
  }


  public static async save(transaction: EntityManager, commandeType: CommandType): Promise<CommandType> {
    return transaction
      .persist(commandeType);
  }

  public static init(transaction: EntityManager, commandTypes) : Promise<Object>{
    let promiseAll : Promise<Object>[] = [];
    commandTypes.forEach(commandType => {
      let command = new CommandType();
      command.name = commandType.name;
      promiseAll.push(CommandTypeRepository.save(transaction, command));
    });
    return Promise.all(promiseAll);
  }

}
