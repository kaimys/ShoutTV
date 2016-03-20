const MAX_STREAMS = 20;

var _ = require('underscore');

var backend = require('./backend');
var ticker = require('./ticker');
var overview = require('./overview');

var streams = exports;
streams.byUpdated = [];
streams.byHotness = [];

// put new streams at the beginning of streams and make sure never more then MAX_STREAMS are inside
backend.on('newStream', function(stream) {
  var updated = false;

  // update existing stream and put it at the beginning of streams
  var existingStream = _.findWhere(streams.byUpdated, { id: stream.id });
  if (existingStream) {
    _.without(streams.byUpdated, existingStream);
    _.without(streams.byHotness, existingStream);
    updated = true;
  }

  // make sure there are never more then MAX_STREAMS in streams
  else if (streams.byUpdated.length > MAX_STREAMS) {
    var oldStream = streams.byUpdated.pop();
    _.without(streams.byHotness, oldStream);
  }

  // add new stream at beginning
  streams.byUpdated.unshift(stream);
  // TODO: not effective on updates as it searches again
  streams.byHotness.unshift(stream);
  streams.byHotness = _.sortBy(streams.byHotness, 'watcher');

  if (updated) {
    ticker.update(stream);
  } else {
    ticker.add(stream);
  }
  overview.render();
});