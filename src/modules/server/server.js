var os = require('os');
var ifaces = os.networkInterfaces();
var program = require('commander');
var logger = require('node-yolog');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
let PORT = program.port || 3000;
let HOSTNAME = program.hostname || '0.0.0.0';
server.listen(PORT, HOSTNAME, null, function () {
    let address = server.address();
    let path = address.address;
    logger.info('Application runs: http://' + path + ':' + PORT);
    logger.info('Check available ip to test with device on the same network:');
    Object.keys(ifaces).forEach(function (ifname) {
        var alias = 0;
        ifaces[ifname].forEach(function (iface) {
            if ('IPv4' !== iface.family || iface.internal !== false) {
                return;
            }
            if (alias >= 1) {
                logger.info('\t-', ifname + ':' + alias, iface.address);
            }
            else {
                logger.info('\t-', ifname, iface.address);
            }
            ++alias;
        });
    });
});
module.exports = {
    'app': app,
    'io': io,
    'server': server
};
