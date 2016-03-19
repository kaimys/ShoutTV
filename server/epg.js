'use strict';

var request = require('request');

var filter = {
  'criteria':[
    {
      'term': 'publishedStartDateTime',
      'operator': 'atLeast',
      'value': '2016-03-19T18:00:00Z'
    }, {
      'term': 'publishedStartDateTime',
      'operator': 'atMost',
      'value': '2016-03-19T22:00:00Z'
    }, {
      'term': 'sourceId',
      'operator': 'in',
      'values': ['756211']  // ProSieben
    }
  ],
  'operator': 'and'
};

var url = 'http://hack.api.uat.ebmsctogroup.com/stores-active/contentInstance/event/filter'
url += '?numberOfResults=100';
url += '&filter=' + JSON.stringify(filter);
url +=  '&api_key=240e4458fc4c6ac85c290481646b21ef';

request(url, function (error, response, body) {
  if (!error) {
    if (response.statusCode == 200) {
      var results = JSON.parse(body);
      results.forEach(function(broadcast) {
        var prog = {
          eventId: broadcast.internalIds.eventId,
          format:  broadcast.internalIds.brandId
        };
        if (!prog.format) {
          prog.format = broadcast.internalIds.seriesId;
        }
        broadcast.searchableTitles.forEach(function(title) {
          if (title.value.DE) {
            prog.title = title.value.DE;
          }
        });
        console.log(prog);
      });
    } else {
      console.log('server returned status %s for url %s', response.statusCode, url);
      console.log(body);
    }
  } else {
    console.log(error);
  }
});
