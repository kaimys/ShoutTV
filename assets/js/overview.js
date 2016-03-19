/// <reference path="../../typings/main.d.ts" />

'use strict';

var $ = require('jquery');

var backend = require('./backend');

exports.show = function () {
  $('#overview').show();
};

exports.hide = function () {
  $('#overview').hide();
};

exports.toggle = function () {
  $('#overview').toggle();
};