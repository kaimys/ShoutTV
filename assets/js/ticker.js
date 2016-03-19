var $ = require('jquery');

var backend = require('./backend');

var $ticker = $('#ticker');
var $elementsBox = $ticker.find('.elements');

function render(ticker) {
  return `<div class="ticker">
    <div class="username">TEST</div>
  </div>`;
}

backend.on('newStream', function(ticker){
  $elementsBox.append(render(ticker));
});