/// <reference path="../../typings/main.d.ts" />

const AMOUNT_HOTTEST_STREAMS = 5;

'use strict';

const ID_PREFIX = 'ticker-';

var _ = require('underscore');
var $ = require('jquery');

var streams = require('./streams');

var $overview = $('#overview');
var $overviewHottest = $('#overview-hottest');
var $overviewNewest = $('#overview-newest');

document.addEventListener('keydown', navigation, true);

function navigation(e) {
  var $activeStream, $newActiveStream;

  switch (e.keyCode) {

    case KeyboardEvent.VK_RED:
      toggle();
      break;

    case KeyboardEvent.VK_ENTER:
      info.toggle();
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
        $activeStream = $overview.find('> .active > .elements > stream.active');
        var $newActiveStream = $activeStream.prev();
        if ($newActiveStream.length && $newActiveStream[0] !== $activeStream[0]) {
          $newActiveStream.addClass('active')
            .siblings().removeClass('active');
        }
      }
      break;

    case KeyboardEvent.VK_DOWN:
      if (isVisible()) {
        $activeStream = $overview.find('> .active > .elements > stream.active');
        var $newActiveStream = $activeStream.next();
        if ($newActiveStream.length && $newActiveStream[0] !== $activeStream[0]) {
          $newActiveStream.addClass('active')
            .siblings().removeClass('active');
        }
      }
      break;

    default:
      console.log(e.keyCode);
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

var info = {
  toggle: function() {
    if ($('#info').length) {
      this.hide();
    } else {
      this.show();
    }
  },
  show: function() {
    var stream = getActiveStream();

    var $info = renderInfo(stream);
    $('body').append($info);
  },
  hide: function() {
    $('#info').remove();
  }
}

function getActiveStream() {
  var $stream = $overview.find('> .active > .elements > .active.stream');
  if ($stream.length === 0) {
    return;
  }
  var streamId = $stream[0].id.replace(ID_PREFIX, '');
  return _.findWhere(streams.byUpdated, { id: parseInt(streamId) });
}

function toggle() {
  $overview.toggle();
  if (isVisible()) {
    exports.render();
    if ($overview.find('> .active').length === 0) {
      select($overviewHottest);
    }
  }
}

function isVisible() {
  return $('#overview').is(":visible"); 
}

function renderInfo(stream) {
  var $elem = $(`<div id="info"></div>`);
  $elem[0].innerHMTL = '<img src="https://chart.googleapis.com/chart?chs=400x400&cht=qr&chl=${encodeURIComponent(stream.stream)}&choe=UTF-8" />';
  return $elem;
}
function render(stream) {
  return `<a id="${ID_PREFIX}${stream.id}" class="stream">${renderInner(stream)}</a>`;
}
function renderInner(stream) {
  return `<div class="user"><div class="image" style="background-image: url(${stream.avatar});"></div> ${stream.user_name}</div>
    <div class="text">${stream.text}</div>
    <div class="watchers">${stream.watcher}</div>`;
}

function renderList($list, streams) {
  var i, $stream;
  var $elements = $list.find('> .elements');

  var unhandledStreamsMap = _.indexBy(streams, 'id');

  var $existingStreams = $elements.children();
  for (i = 0; i < $existingStreams.length; i++) {
    var streamElem = $existingStreams[i];
    
    // update stream
    var streamId = streamElem.id.replace(ID_PREFIX, '');
    if (streamId in unhandledStreamsMap) {
      streamElem.innerHTML = renderInner(unhandledStreamsMap[streamId]);
      unhandledStreamsMap[streamElem.id] = false;
    }
    // remove stream
    else {
      $stream = $(streamElem);
      if ($stream.hasClass('active')) {
        var $prev = $stream.prev(':not(.active)');
        if ($prev.length && $prev[0] !== $stream[0]) {
          $prev.addClass('active');
        } else {
          $stream.next().addClass('active');
        }
      }
      $stream.remove();
    }
  }

  for (i = 0; i < streams.length; i++) {
    var stream = streams[i];
    // render only not already updated streams
    if (unhandledStreamsMap[stream.id]) {
      $stream = $(render(stream));
      $elements.prepend($stream);
    }
  }
}