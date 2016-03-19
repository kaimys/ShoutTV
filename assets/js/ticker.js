var $ = require('jquery');

var backend = require('./backend');

var $ticker = $('#ticker');
var $elementsBox = $ticker.find('.elements');
var $elementsBox = $ticker.find('.elements');

function render(ticker) {
  return `<a class="ticker">
    <div class="username">TEST</div>
  </a>`;
}

backend.on('newStream', function(ticker){
  $elementsBox.append(render(ticker));
});