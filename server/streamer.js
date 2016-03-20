'use strict';

var Twitter = require('twitter');

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

var pollInterval;
var since_id;

function doQuery(hashTag, callback) {
  var query = {q: '#periscope ' + hashTag};
  if (since_id) {
    query.since_id = since_id;
  }
  client.get('search/tweets', query, function(error, tweets, response){
    if (!error) {
      console.log('maxid: %s, %s streams', tweets.search_metadata.max_id, tweets.statuses.length);
      since_id = tweets.search_metadata.max_id;
      var status;
      for (var i = 0; i < tweets.statuses.length; i++) {
        status = tweets.statuses[i];
        console.log('%s %s', i, status.text);
        if (status.source == '<a href="https://periscope.tv" rel="nofollow">Periscope</a>') {
          var stream = {
            id: status.id,
            created_at: status.created_at,
            avatar: status.user.profile_image_url,
            text: status.text,
            user_name: status.user.name,
            location: status.user.location,
          };
          var match = status.text.match(/https:\/\/t\.co\/[A-Za-z0-9]*$/);
          if (match) {
            stream.stream = match[0];
            stream.text = status.text.substr(0, status.text.length - match[0].length);
            callback(stream);
            break; // only take the first stream
          }
        }
      }
    }
  });
}

module.exports = {

  start: function(hashTag, callback) {
    doQuery(hashTag, function() {}); // first serach will only set since_id
    pollInterval = setInterval(function() {
      doQuery(hashTag, callback);
    }, 10000);
  },

  stop: function() {
    clearInterval(pollInterval);
  }
};
