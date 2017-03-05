import { ViewCommandTypeRepository } from './repository/ViewCommandTypeRepository';
import { ViewCommandType } from './entities/ViewCommandType';
import { CommandType } from './entities/CommandType';
import { View } from './entities/View';
import { ApplicationDto } from './dto/ApplicationDto';
import {Command} from "./entities/Command";
import {Application} from "./entities/Application";
import {CommandRepository}  from "./repository/CommandRepository"
import {ApplicationRepository}  from "./repository/ApplicationRepository"
import {CommandTypeRepository}  from "./repository/CommandTypeRepository"
import {ViewRepository}  from "./repository/ViewRepository"
import * as connectionManager from "./repository/Connection";
import {deserialize, serialize} from 'json-typescript-mapper';
import {getJson} from "./init";

export async function init() : Promise<Object> {
  let connectionMere = await connectionManager.session();
  let transaction = connectionMere.entityManager.transaction(async connection=>{
    return initDb(connection, getJson());
  });
  return transaction;
};


function initDb(connection, init){
  let viewPromises = [];
  init.views.forEach(view=>viewPromises.push(initViews(connection, view)));
  return Promise.all(viewPromises).then(result=>{
    viewPromises = [];
    init.applications.forEach(app=>viewPromises.push(initApplication(connection, app)));
    let last = Promise.all(viewPromises);
    last.catch(error=>console.log(error));
    return last;
  });
}

function initViews(connection, view):Promise<any>{
  let nview:View = new View();
  nview.name = view.name;
  return ViewRepository.save(connection, nview).then(result=>{
    let viewPromises: Promise<any>[] = [];
    view.commandesTypes.forEach(ct=>
      viewPromises.push(initCommandesTypes(connection, ct, result)));
    return Promise.all(viewPromises);
  });
}

function initCommandesTypes(connection, commandType, viewSaved):Promise<any> {
  let ncommandType:CommandType = new CommandType();
  ncommandType.name = commandType.name;
  let viewCommandType = new ViewCommandType();
  viewCommandType.view = viewSaved;

  return CommandTypeRepository.save(connection, ncommandType).then(result=>{
    viewCommandType.commandType = result;
    if(commandType.command){
      let ncommand: Command = new Command();
      ncommand.name = commandType.command.name;
      ncommand.shell = commandType.command.shell;
      return CommandRepository.save(connection, ncommand).then(commandResult=>{
        viewCommandType.command = commandResult;
        return ViewCommandTypeRepository.save(connection, viewCommandType);
      });
    } else {
      return ViewCommandTypeRepository.save(connection, viewCommandType);
    }
  });
}

function initApplication(connection, application){
  let napplication: Application = new Application();
  napplication.name = application.name;
  napplication.id = application.id;
  return ViewRepository.findOne(connection, application.view)
    .then(view=>{
      napplication.view = view;
      return ApplicationRepository.save(connection, napplication).then(app=>{
        let promises = [];
        application.commands.forEach(command=>{
          let ncommand: Command = new Command();
          ncommand.name = command.name;
          ncommand.shell = command.shell;
          ncommand.applications = [app];
          promises.push(CommandRepository.save(connection, ncommand));
        })
        return Promise.all(promises);
      });
    });
}

/*
{
        "id":"SMPLAYER.SMPLAYER",
        "name":"SMPlayer",
        "view":"Player",
        "commands":null
    } */