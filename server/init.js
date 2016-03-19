'use strict';

var path = require('path');
var fs = require('fs');
var express = require('express');
var socketIO       = require('socket.io')

var app = express();
app.use(function(req, res, next) {
  console.log('%s %s', req.method, req.url, req.headers['user-agent']);
  next();
});
app.use(express.static(path.join(__dirname, '../public')));
var server = app.listen(8888);

var io = socketIO(server);

io.on('connection', function(socket) {
  console.log('a user connected');
  var interval = setInterval(function() {
    socket.emit('newStream', {url: 'http://server.com'});
    console.log('message emmited');
  }, 5000);
  socket.on('disconnect', function() {
    clearInterval(interval);
    console.log('user disconnected');
  });
});

server.listen(8888, function(){
  console.log('listening on *:8888');
});
