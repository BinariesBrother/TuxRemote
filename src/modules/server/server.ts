import * as os from "os";
import * as program from "commander";
import * as logger from "node-yolog";
import * as express from "express";
import * as http from "http";
import * as socketIo from "socket.io";

export let app = express();
export let server = http.createServer(app);
export let io = socketIo.listen(server);

let ifaces  = os.networkInterfaces();

const PORT = program.port || 3000;
const HOSTNAME = program.hostname || "0.0.0.0";

export function init() {
  server.listen(PORT, HOSTNAME, null, function() {
    let address = server.address();
    let path = address.address;
    logger.info("Application runs: http://" + path + ":" + PORT);
    logger.info("Check available ip to test with device on the same network:");
    Object.keys(ifaces).forEach(function (ifname) {
      let alias = 0;
      ifaces[ifname].forEach(function (iface) {
        if ("IPv4" !== iface.family || iface.internal !== false) {
          // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
          return;
        }
        if (alias >= 1) {
          // this single interface has multiple ipv4 addresses
          logger.info("\t-", ifname + ":" + alias, iface.address);
        } else {
          // this interface has only one ipv4 adress
          logger.info("\t-", ifname, iface.address);
        }
        ++alias;
      });
    });
  });
}