'use strict';

var request = require('request');
var _ = require('underscore');

var hashMap = {
  '140014630466': '#TBBT',          // The Bing Bang Theory
  '140043126612': '#2brokegirls',   // 2 Broke Girls
  '140014680823': '#TAAHM',         // Two and a half men
  '140021780633': '#CougarTown',
  '140024131129': '#MikeAndMolly',
  '140023920253': '#TheMiddle',
  '559632993':    '#TheWatch',
  '140191056739': '#TEAMWORK',
  '140039622210': '#NEWSTIME',
  '557080399':    '#YearOne',
  '559632992':    '#BatVsSuper',
  '557080395':    '#JoeDreck',
  '557080396':    '#HaroldKumar'
};

var baseUrl = 'http://hack.api.uat.ebmsctogroup.com/stores-active/contentInstance/event/filter?api_key=240e4458fc4c6ac85c290481646b21ef';

function getCurrentBroacast(callback) {
  var now = new Date();
  var then = new Date(now.getTime() + 3600000*1);
  var now = new Date(now.getTime() - 3600000*1);
  var filter = {
    'criteria':[
      {
        'term': 'publishedStartDateTime',
        'operator': 'atLeast',
        'value': now.toISOString()
      }, {
        'term': 'publishedStartDateTime',
        'operator': 'atMost',
        'value': then.toISOString()
      }, {
        'term': 'sourceId',
        'operator': 'in',
        'values': ['756211']  // ProSieben
      }
    ],
    'operator': 'and'
  };

  var url = baseUrl + '&numberOfResults=100&filter=' + JSON.stringify(filter);

  request(url, function (error, response, body) {
    if (!error) {
      if (response.statusCode == 200) {
        var results = JSON.parse(body);
        var resProg = [];
        _.chain(results)
        .sortBy(function(b) { return b.publishedStartDateTime; })
        .each(function(broadcast) {
          var startTime = new Date(broadcast.publishedStartDateTime);
          var prog = {
            paId: broadcast.internalIds.programmeAbstractionId,
            eventId: broadcast.internalIds.eventId,
            format:  broadcast.internalIds.brandId || broadcast.internalIds.seriesId || broadcast.internalIds.eventId,
            startTime: startTime,
            endTime: new Date(startTime.getTime() + broadcast.publishedDuration * 1000),
            duration: broadcast.publishedDuration,
            hash: []
          };
          broadcast.searchableTitles.forEach(function(title) {
            if (title.value.DE) {
              prog.title = title.value.DE;
            }
          });
          if (hashMap[prog.format]) {
            prog.hash.push(hashMap[prog.format]);
          }
          resProg.push(prog);
        });
        callback(undefined, resProg);
      } else {
        console.log('server returned status %s for url %s', response.statusCode, url);
        console.log(body);
        callback(body);
      }
    } else {
      console.log(error);
      callback(error);
    }
  });
}

function getBroadcast(programmeAbstractionId) {
  var filter = {
    'term': 'internalIds.programmeAbstractionId',
    'value': programmeAbstractionId
  };
  var url = baseUrl + '&numberOfResults=10&filter=' + JSON.stringify(filter);

  request(url, function (error, response, body) {
    if (!error) {
      console.log(JSON.parse(body));
    } else {
      console.log(error);
    }
  });
}

//getCurrentBroacast(function() {});
//getBroadcast('crid://bds.tv/100112971362');

module.exports = {
  'getCurrentBroacast': getCurrentBroacast,
  'getBroadcast': getBroadcast
};
