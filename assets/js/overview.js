/// <reference path="../../typings/main.d.ts" />

const AMOUNT_HOTTEST_STREAMS = 5;

'use strict';

var _ = require('underscore');
var $ = require('jquery');

var streams = require('./streams');

var $overview = $('#overview');
var $overviewHottest = $('#overview-hottest');
var $overviewNewest = $('#overview-newest');

document.addEventListener('keydown', navigation, true);
document.addEventListener('keypress', navigation, true);

function navigation(e) {
  switch (e.keyCode) {

    case KeyboardEvent.VK_RED:
      toggle();
      break;

    case KeyboardEvent.VK_LEFT:
      if (isVisible()) {
        select($overviewHottest);
      }
      break;

    case KeyboardEvent.VK_RIGHT:
      if (isVisible()) {
        select($overviewNewest);
      }
      break;

    case KeyboardEvent.VK_UP:
      if (isVisible()) {
        var $newActiveStream = $overview.find('> .elements > .active > streams.active').prev();
        if ($newActiveStream.length) {
          $newActiveStream.addClass('active')
            .siblings().removeClass('active');
        }
      }
      break;

    case KeyboardEvent.VK_DOWN:
      if (isVisible()) {
        var $newActiveStream = $overview.find('> .elements > .active > streams.active').next();
        if ($newActiveStream.length) {
          $newActiveStream.addClass('active')
            .siblings().removeClass('active');
        }
      }
      break;
  }
}

function select($list) {
  if (!$list.hasClass('active')) {
    $list.addClass('active')
      .siblings().removeClass('active');
    var $streams = $list.find('> .elements')
      .children().removeClass('active')
      .first().addClass('active');
  }
}

exports.render = function() {
  if (isVisible()) {
    renderList($overviewNewest, streams.byUpdated);
    renderList($overviewHottest, streams.byHotness.slice(
      Math.max(0, streams.byHotness.length - AMOUNT_HOTTEST_STREAMS - 1),
      streams.byHotness.length)
    );
  }
};

function toggle() {
  $overview.toggle();

  if (isVisible()) {
    exports.render();
    select($overviewHottest);
  }
}

function isVisible() {
  return $('#overview').is(":visible"); 
}

function render(stream) {
  return `<a id="ticker-${stream.id}" class="stream">${renderInner(stream)}</a>`;
}
function renderInner(stream) {
  return `<div class="user"><div class="image" style="background-image: url(${stream.avatar});"></div> ${stream.user_name}</div>
    <div class="text">${stream.text}</div>
    <div class="watchers">${stream.watcher}</div>`;
}

function renderList($list, streams) {
  var i, $stream;
  var $streams = $list.find('> .elements');

  var unhandledStreamsMap = _.indexBy(streams, 'id');

  var $existingStreams = $streams.children();
  for (i = 0; i < $existingStreams.length; i++) {
    var streamElem = $existingStreams[i];
    
    // update stream
    if (streamElem.id in unhandledStreamsMap) {
      streamElem.innerHTML = renderInner(stream);
      unhandledStreamsMap[streamElem.id] = false;
    }
    // remove stream
    else {
      $stream = $(streamElem);
      if ($stream.hasClass('active')) {
        $stream.prev().addClass('active');
        $stream.remove();
      }
    }
  }

  for (i = 0; i < streams.length; i++) {
    var stream = streams[i];
    // render only not already updated streams
    if (unhandledStreamsMap[stream.id]) {
      $stream = $(render(stream));
      $streams.prepend($stream);
    }
  }
}