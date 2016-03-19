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
  var i = 0;
  var interval = setInterval(function() {
    var data = {
      id: testStreams[i].id,
      created_at: testStreams[i].created_at,
      user_name: testStreams[i].user_name,
      avatar: testStreams[i].avatar,
      location: testStreams[i].location,
      text: testStreams[i].text,
      stream: 'http://server.com',
      screenShot: 'http://url.to.screenshot',
      watcher: 33
    };
    socket.emit('newStream', data);
    console.log('message emmited');
    i = (i+1) % testStreams.length;
  }, 5000);
  socket.on('disconnect', function() {
    clearInterval(interval);
    console.log('user disconnected');
  });
});

server.listen(8888, function(){
  console.log('listening on *:8888');
});
