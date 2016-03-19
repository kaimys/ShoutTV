'use strict';

var path = require('path');
var fs = require('fs');
var express = require('express');

var app = express();
app.use(function(req, res, next) {
  console.log('%s %s', req.method, req.url, req.headers['user-agent']);
  next();
});
app.use(express.static(path.join(__dirname, '../public')));
app.listen(8888);
