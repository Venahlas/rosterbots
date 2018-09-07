'use strict';

import express from 'express';
import http from 'http';
import config from './config';
var app = express();
var server = http.createServer(app);


require('./routes').default(app);


function startServer() {
  server.listen(config.port, config.ip, function() {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });
}

Promise.resolve()
  .then(startServer)
  .catch(function(err) {
    console.log('Server failed to start due to error: %s', err);
  });

exports = module.exports = app;
