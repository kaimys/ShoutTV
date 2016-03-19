const MAX_STREAMS = 100;

var _ = require('underscore');

var backend = require('./backend');
var ticker = require('./ticker');

var streams = [];
var streamsMap = {};

// put new streams at the beginning of streams and make sure never more then MAX_STREAMS are inside
backend.on('newStream', function(stream) {
  var updated = false;

  // update existing stream and put it at the beginning of streams
  if (stream.id in streamsMap) {
    _.without(streams, streamsMap[stream.id]);
    updated = true;
    return;
  }

  // make sure there are never more then MAX_STREAMS in streams
  else if (streams.length > MAX_STREAMS) {
    var oldStream = streams.pop();
    delete stream[oldStream.id];
  }

  // add new stream at beginning and set it in the map
  streamsMap[stream.id] = stream;
  streams.unshift(stream);

  if (updated) {
    ticker.update(stream);
  } else {
    ticker.add(stream);
  }
});