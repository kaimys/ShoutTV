'use strict';

var path = require('path');
var fs = require('fs');
var express = require('express');
var socketIO = require('socket.io');
var streamer = require('./streamer');

// express setup
var app = express();
app.use(function(req, res, next) {
  console.log('%s %s', req.method, req.url, req.headers['user-agent']);
  next();
});
app.use(express.static(path.join(__dirname, '../public')));
var server = app.listen(8888);

// socket.io setup
var io = socketIO(server);
io.on('connection', function(socket) {
  console.log('a user connected');
  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
});

server.listen(8888, function(){
  console.log('listening on *:8888');
});

// twitter feed setup
streamer.start('', function(stream) {
  var data = {
    id: stream.id,
    created_at: stream.created_at,
    user_name: stream.user_name,
    avatar: stream.avatar,
    location: stream.location,
    text: stream.text,
    stream: 'http://server.com',
    screenShot: 'http://url.to.screenshot',
    watcher: stream.watcher
  };
  io.emit('newStream', data);
  console.log('message emmited');
});
