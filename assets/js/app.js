'use strict';

require('./hbbtv');

var backend = require('./backend');

window.addEventListener('load', function() {

  require('./streams');

  var overview = require('./overview');
  var ticker = require('./ticker');

}, true);