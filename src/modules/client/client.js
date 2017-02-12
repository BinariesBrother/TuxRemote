"use strict";
const express = require("express");
const logger = require("node-yolog");
const path = require("path");
const server_1 = require("../server/server");
let appDir = path.dirname(require.main.filename);
let static_dirs = [
    appDir + "/static/",
    __dirname + "/app/",
];
logger.debug("Static folders are:");
for (let i in static_dirs) {
    server_1.app.use(express.static(static_dirs[i]));
    logger.debug(static_dirs[i]);
}
