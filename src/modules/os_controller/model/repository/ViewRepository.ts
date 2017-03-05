import {View} from "../entities/View";
import * as connectionManager from "./Connection";
import {CommandTypeRepository} from "./CommandTypeRepository";
import {ViewCommandTypeRepository} from "./ViewCommandTypeRepository";
import {ViewCommandType} from "../entities/ViewCommandType";
import {EntityManager} from "typeorm";


export class ViewRepository {


  public static async findAll(transaction: EntityManager): Promise<View[]> { 
    return transaction.getRepository(View)
      .find();
  }


  public static async findOne(transaction: EntityManager, viewName: String): Promise<View> {
    return transaction.getRepository(View)
      .createQueryBuilder("view")
      .where("view.name LIKE :viewName"
      , { viewName: viewName })
      .getOne();
  }


  public static async findOneByApplicationId(transaction: EntityManager, applicationId: Number): Promise<View> {
    return transaction.getRepository(View)
      .createQueryBuilder("view")
      .leftJoin("view.application", "application")
      .where("application.id LIKE :applicationId"
      , { applicationId: applicationId })
      .getOne();
  }

  public static async save(transaction: EntityManager, view: View): Promise<View> {
    return transaction
      .persist(view);
  }

  public static init(transaction: EntityManager, views) : Promise<Object>{
    let promiseAll : Promise<Object>[] = [];
    views.forEach(viewDto =>{
      let view = new View();
      view.name = viewDto.name;
      promiseAll.push(ViewRepository.save(transaction, view).then(result =>{
        let promiseAll2 : Promise<Object>[] = [];
        viewDto.commandTypes.forEach(commandType => {
          promiseAll2.push(CommandTypeRepository.findOne(transaction,commandType).then(command => {
            let viewCommandType = new ViewCommandType();
            viewCommandType.commandType= command;
            viewCommandType.view = result;
            return ViewCommandTypeRepository.save(transaction, viewCommandType);
          }));
        });
        return Promise.all(promiseAll2);
      }));
    });
    return Promise.all(promiseAll);
  }
}