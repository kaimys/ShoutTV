'use strict';

var streamer = require('./streamer');

streamer.start('', function(stream) {
  console.log(stream);
});
