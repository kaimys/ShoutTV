'use strict';

var path = require('path');
var fs = require('fs');
var express = require('express');
var socketIO = require('socket.io');
var streamer = require('./streamer');
var periscope = require('./periscope');

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
  periscope(stream.stream, function(err, pscope) {
    if (!err) {
      var data = {
        id: stream.id,
        created_at: stream.created_at,
        user_name: stream.user_name,
        avatar: stream.avatar,
        location: stream.location,
        text: stream.text,
        stream: stream.stream,
        screenShot: pscope.broadcast.image_url,
        watcher: pscope.n_watching || pscope.n_watched || 0
      };
      io.emit('newStream', data);
      console.log(data);
    } else {
      console.log(err);
    }
  });
});
