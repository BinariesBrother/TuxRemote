"use strict";
const os = require("os");
const program = require("commander");
const logger = require("node-yolog");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
exports.app = express();
exports.server = http.createServer(exports.app);
exports.io = socketIo.listen(exports.server);
let ifaces = os.networkInterfaces();
const PORT = program.port || 3000;
const HOSTNAME = program.hostname || "0.0.0.0";
exports.server.listen(PORT, HOSTNAME, null, function () {
    let address = exports.server.address();
    let path = address.address;
    logger.info("Application runs: http://" + path + ":" + PORT);
    logger.info("Check available ip to test with device on the same network:");
    Object.keys(ifaces).forEach(function (ifname) {
        let alias = 0;
        ifaces[ifname].forEach(function (iface) {
            if ("IPv4" !== iface.family || iface.internal !== false) {
                return;
            }
            if (alias >= 1) {
                logger.info("\t-", ifname + ":" + alias, iface.address);
            }
            else {
                logger.info("\t-", ifname, iface.address);
            }
            ++alias;
        });
    });
});
