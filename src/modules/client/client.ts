import * as express from "express";
import * as logger from "node-yolog";
import * as path from "path";
import {app} from "../server/server";

let appDir = path.dirname(require.main.filename);

let static_dirs = [
  appDir + "/static/", // Global static folder.
  __dirname + "/app/",
];

logger.debug("Static folders are:");
for (let i in static_dirs) {
  app.use(express.static(static_dirs[i]));
  logger.debug(static_dirs[i]);
}

// app.get('/', function(req, res){
//   logger.debug('home request');
//   res.sendFile(__dirname + '/app/index.html');
// });
