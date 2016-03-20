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

  var appMan = document.getElementById('oipfApplicationManager');
  var config = document.getElementById('oipfConfiguration') || {};

  if (!appMan || !appMan.getOwnerApplication)
    return;

  application = appMan.getOwnerApplication(document);

  // Opera TV Emulator 3.4 can't get application
  if (!application)
    return;

  if (!application.privateData)
    application.privateData = {};

  keyset = application.privateData.keyset || config.keyset || {};
  keyset.setValue || (keyset.setValue = function() {});

  application.privateData.keyset.setValue(initKeys);

}, true);