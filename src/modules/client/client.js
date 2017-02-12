var express = require('express');
var logger = require('node-yolog');
var server = require('../server/server.js');
var path = require('path');
var appDir = path.dirname(require.main.filename);
var app = server.app;
var static_dirs = [
    appDir + '/static/',
    __dirname + '/app/',
];
logger.debug('Static folders are:');
for (var i in static_dirs) {
    app.use(express.static(static_dirs[i]));
    logger.debug(static_dirs[i]);
}
