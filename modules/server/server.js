var program = require('commander');
var logger  = require('node-yolog');
var express = require('express');
var app     = express();
var server  = require('http').Server(app);
var io      = require('socket.io').listen(server);

let PORT = program.port || 3000;
server.listen(PORT);
logger.info('Server listening on port ' + PORT);

module.exports = {
  'app': app,
  'io': io,
  'server': server
}
