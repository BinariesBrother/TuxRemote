import {ViewCommandType} from "../entities/ViewCommandType";
import {CommandTypeRepository} from "./CommandTypeRepository";
import {ViewRepository} from "./ViewRepository";
import * as connectionManager from "./Connection";
import {EntityManager} from "typeorm";


export class ViewCommandTypeRepository {

  public static async findAll(transaction: EntityManager): Promise<ViewCommandType[]> {
    return transaction.getRepository(ViewCommandType)
      .find();
  }

  public static async findOne(transaction: EntityManager, commandName: String): Promise<ViewCommandType> {
    return transaction.getRepository(ViewCommandType)
      .createQueryBuilder("viewCommandType")
      .where("viewCommandType.name LIKE :commandName"
      , { commandName: commandName })
      .getOne();
  }


  public static async save(transaction: EntityManager, commandeType: ViewCommandType): Promise<ViewCommandType> {
    return transaction
      .persist(commandeType);
  }
}
