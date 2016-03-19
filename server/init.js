'use strict';

var path = require('path');
var fs = require('fs');
var express = require('express');
var socketIO = require('socket.io');

var testStreams = require('../streams');

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
    var stream = testStreams[Math.round((testStreams.length - 1) * Math.random())];
    stream.watcher = Math.round(100 * Math.random());
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
    socket.emit('newStream', data);
    console.log('message emmited');
  }, 1000);
  socket.on('disconnect', function() {
    clearInterval(interval);
    console.log('user disconnected');
  });
});

server.listen(8888, function(){
  console.log('listening on *:8888');
});
