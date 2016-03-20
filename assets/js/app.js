'use strict';

require('./hbbtv');

var backend = require('./backend');

window.addEventListener('load', function() {

  require('./overview');
  require('./ticker');

  document.addEventListener('keydown', navigation, true);
  document.addEventListener('keypress', navigation, true);
  function navigation(e) {
    if (e.keyCode === KeyboardEvent.VK_YELLOW) {
      location.reload();
    }
  }

}, true);