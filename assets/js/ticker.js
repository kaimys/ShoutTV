/// <reference path="../../typings/main.d.ts" />

const MAX_DISPLAYED = 3;
const TIMEOUT = 5000;

var $ = require('jquery');

var $ticker = $('#ticker');
var $logo = $ticker.find('> .logo');
var $elements = $ticker.find('> .elements');

function render(stream, flyIn) {
  return `<a href="#overview-newest" id="ticker-${stream.id}" class="stream" data-updated="${Date.now()}">
    <div class="user">Live Stream von ${stream.user_name}</div>
    <div class="text">${stream.text || ''}</div>
    <div class="watchers">(${stream.watcher} Zuschauer)</div>
  </a>`;
}

// remove streams after timeout
setInterval(function () {
  var now = Date.now();
  $elements.children().each(function(i, child) {
    var $child = $(child);
    if (now - $child.data('updated') > TIMEOUT) {
      $child.remove();
    }
  });
}, 500);

exports.add = function(stream) {
  var $children = $elements.children();
  if ($children.length >= MAX_DISPLAYED) {
    $($children[0]).remove();
  }
  var $new = $(render(stream, true)).css('margin-left', '1280px');
  $elements.append($new);
  setTimeout(function() {
    $new.css('margin-left', '0');
  }, 0);  
};

exports.update = function(stream) {
  var $existingStream = $elements.find('#ticker-' + stream.id);
  if ($existingStream.length) {
    $existingStream.replaceWith(render(stream));
    // TODO: add flash event
  } else {
    exports.add(stream);
  }
};