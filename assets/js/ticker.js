/// <reference path="../../typings/main.d.ts" />

const MAX_DISPLAYED = 5;

var $ = require('jquery');

var $ticker = $('#ticker');
var $logo = $ticker.find('> .logo');
var $elements = $ticker.find('> .elements');

function render(stream) {
  return `<a id="ticker-${stream.id}" class="ticker">
    <div class="user"><div class="image" style="background-image: url(${stream.avatar});"></div> ${stream.user_name}</div>
    <div class="watchers">${stream.watcher}</div>
  </a>`;
}

exports.add = function(stream) {
  $elements.append(render(stream));
};

exports.update = function(stream) {
  var $existingStream = $elements.find('#ticker-' + stream.id);
  if ($existingStream.length) {
    $existingStream.find('> .watchers').text(stream.watcher);
  }
  // TODO: add flash event
};