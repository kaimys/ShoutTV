'use strict';

var backend = require('socket.io/node_modules/socket.io-client')();

// Add a connect listener
backend.on('connect',function() {
  console.log('Client has connected to the server!');
});

// Add a disconnect listener
backend.on('disconnect',function() {
  console.log('The client has disconnected!');
});

module.exports = backend;