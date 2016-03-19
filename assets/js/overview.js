/// <reference path="../../typings/main.d.ts" />

const AMOUNT_HOTTEST_STREAMS = 5;

'use strict';

var _ = require('underscore');
var $ = require('jquery');

var backend = require('./backend');

var $overview = $('#overview');
var $overviewHottest = $('#overview-hottest');
var $overviewNewest = $('#overview-newest');

exports.toggle = function () {
  $('#overview').toggle();
};

function render(stream) {
  return `<a id="ticker-${stream.id}" class="stream">${renderInner(stream)}</a>`;
}
function renderInner(stream) {
  return `<div class="user"><div class="image" style="background-image: url(${stream.avatar});"></div> ${stream.user_name}</div>
    <div class="text">${stream.text}</div>
    <div class="watchers">${stream.watcher}</div>`;
}

exports.render = function(streamsByUpdated, streamsByHotness) {
  renderList($overviewNewest, streamsByUpdated);
  renderList($overviewHottest, streamsByHotness.slice(Math.max(0, streamsByHotness.length - AMOUNT_HOTTEST_STREAMS - 1), streamsByHotness.length));
}

function renderList($list, streams) {
  var i;

  var unhandledStreamsMap = _.indexBy(streams, 'id');

  var $existingStreams = $list.children();
  for (i = 0; i < $existingStreams.length; i++) {
    var streamElem = $existingStreams[i];
    if (streamElem.id in unhandledStreamsMap) {
      streamElem.innerHTML = renderInner(stream);
      unhandledStreamsMap[streamElem.id] = false;
    } else {
      $(streamElem).remove();
    }
  }

  for (i = 0; i < streams.length; i++) {
    var stream = streams[i];
    $list.prepend(render(stream));
  }
}