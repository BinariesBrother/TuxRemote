var express = require('express');
var logger  = require('node-yolog');
var server  = require('../server/server.js');
var app     = server.app;

var static_dirs = [
  '/app/',
];
for (var i in static_dirs) {
  app.use(express.static(__dirname + static_dirs[i]));
}

// app.get('/', function(req, res){
//   logger.debug('home request');
//   res.sendFile(__dirname + '/app/index.html');
// });
