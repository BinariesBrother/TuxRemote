import {View} from "../entities/View";
import * as connectionManager from "./Connection";
import {CommandTypeRepository} from "./CommandTypeRepository";
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

  public static addCommandTypeDto(transaction: EntityManager, view, commandType): Promise<View>{
    return CommandTypeRepository.findOne(transaction, commandType).then(command => {
      console.log("\t", command.name);
      view.commandTypes.push(command);
      return ViewRepository.save(transaction, view);
    });
  }

  public static addCommandTypesDto(transaction: EntityManager, view : View, commandTypes) : Promise<View>{
    if(commandTypes.length==0){ 
      return new Promise(resolve=>resolve(view));
    }else{
      return ViewRepository.addCommandTypeDto(transaction, view, commandTypes.pop())
        .then(r=> ViewRepository.addCommandTypesDto(transaction, r, commandTypes))
        .catch(error=> console.log(error));
    }
  }

  public static init(transaction: EntityManager, views) : Promise<Object>{
    if(views.length==0){
      return ViewRepository.findAll(transaction);
    }else{
      let viewDto = views.pop();
      let view = new View();
      view.name = viewDto.name;
      return ViewRepository.save(transaction, view).then(v=> ViewRepository
        .addCommandTypesDto(transaction, v, viewDto.commandTypes).then(r=>{
          console.log(r);
          return ViewRepository.init(transaction, views)
        }));
    }
  }
}
/*
result =>{
        let promiseAll2 : Promise<Object>[] = [];
        viewDto.commandTypes.forEach(commandType => {
          promiseAll2.push(CommandTypeRepository.findOne(commandType).then(command => {
            console.log(result.name, command.name);
            result.commandTypes.push(command);
            return ViewRepository.save(result);
          }));
        });
        return Promise.all(promiseAll2);
      }
*/