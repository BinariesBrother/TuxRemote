import {createConnection} from "typeorm";
const path = require("path");

let connection = undefined;

var fs = require('fs');
var filePath = __dirname + "/../dbFile.sqlite";
fs.unlinkSync(filePath);

export function session() {
  if (!connection) {
    connection = createConnection({
      driver: {
        type: "sqlite",
        storage: __dirname + "/../dbFile.sqlite",
        username: "root",
        password: "admin",
        database: "test"
      },
      entities: [
        __dirname + "/../entities/*.js"
      ],
      autoSchemaSync: true,
      dropSchemaOnConnection: false
    });
  }
  return connection;
}

export async function transaction(){
  return session().then(connectionMere=>connectionMere.entityManager.transaction);
}

