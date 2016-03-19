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
      console.log('maxid=' + tweets.search_metadata.max_id);
      since_id = tweets.search_metadata.max_id;
      tweets.statuses.forEach(function(status) {
        if (status.source == '<a href="https://periscope.tv" rel="nofollow">Periscope</a>') {
          var stream = {
            id: status.id,
            created_at: status.created_at,
            avatar: status.user.profile_image_url,
            text: status.text,
            user_name: status.user.name,
            location: status.user.location,
          };
          callback(stream);
        }
      });
    }
  });
}

module.exports = {

  start: function(hashTag, callback) {
    doQuery(hashTag, callback);
    pollInterval = setInterval(function() {
      doQuery(hashTag, callback);
    }, 30000);
  },

  stop: function() {
    clearInterval(pollInterval);
  }
};
