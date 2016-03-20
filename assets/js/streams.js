const MAX_STREAMS = 20;

var _ = require('underscore');

var backend = require('./backend');
var ticker = require('./ticker');
var overview = require('./overview');

var streamsByUpdated = [];
var streamsByHotness = [];

// put new streams at the beginning of streams and make sure never more then MAX_STREAMS are inside
backend.on('newStream', function(stream) {
  var updated = false;

  // update existing stream and put it at the beginning of streams
  var existingStream = _.findWhere(streamsByUpdated, { id: stream.id });
  if (existingStream) {
    _.without(streamsByUpdated, existingStream);
    _.without(streamsByHotness, existingStream);
    updated = true;
  }

  // make sure there are never more then MAX_STREAMS in streams
  else if (streamsByUpdated.length > MAX_STREAMS) {
    var oldStream = streamsByUpdated.pop();
    _.without(streamsByHotness, oldStream);
  }

  // add new stream at beginning
  streamsByUpdated.unshift(stream);
  // TODO: not effective on updates as it searches again
  streamsByHotness.unshift(stream);
  streamsByHotness = _.sortBy(streamsByHotness, 'watcher');

  if (updated) {
    ticker.update(stream);
  } else {
    ticker.add(stream);
  }
  overview.render(streamsByUpdated, streamsByHotness);
});