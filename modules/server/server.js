var program = require('commander');
var logger  = require('node-yolog');
var express = require('express');
var app     = express();
var server  = require('http').Server(app);
var io      = require('socket.io').listen(server);

let PORT = program.port || 3000;
let HOSTNAME = program.hostname || '0.0.0.0';
server.listen(PORT, HOSTNAME, null, function() {
  let address = server.address();
  let path = address.address;
  logger.info('Application runs: http://' + path + ':' + PORT);
});



module.exports = {
  'app': app,
  'io': io,
  'server': server
}
