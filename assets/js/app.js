'use strict';

require('./hbbtv');

var backend = require('./backend');

window.addEventListener('load', function() {

  var overview = require('./overview');
  var ticker = require('./ticker');

  document.addEventListener('keypress', function(e){
    if (e.keyCode == KeyboardEvent.VK_RED) {
      overview.toggle();
    }
  }, true);

}, true);