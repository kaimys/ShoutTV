'use strict';

var path = require('path');
var fs = require('fs');
var Entities = require('html-entities').AllHtmlEntities;
var request = require('request');
var entities = new Entities();

/*var html = fs.readFileSync(path.join(__dirname, '../fixtures/periscope.html'), 'utf8');*/

module.exports = function(url, callback) {
  request(url, function (error, response, body) {
    if (!error) {
      var match = body.match(/id="broadcast-data" content="([^"]*)"/);
      try {
        callback(undefined, JSON.parse(entities.decode(match[1])));
      } catch (err) {
        callback(err);
      }
    } else {
      callback(error);
    }
  });
};
