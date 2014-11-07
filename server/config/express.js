/**
 * Express configuration
 */

'use strict';

var express = require('express');
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var path = require('path');
var config = require('./environment');

module.exports = function(app) {
  var env = app.get('env');

  app.set('views', config.root + '/server/views');
  app.set('view engine', 'ejs');

  app.use(compression());
  app.use(bodyParser.urlencoded({
    extended: false
  }));
  app.use(bodyParser.json());
  app.use(cookieParser());
  if ('production' === env) {
    app.use('/labs/', express.static(path.join(config.root, 'public')));
    app.use('/labs/labs/', express.static(path.join(config.root, 'public')));
    app.set('appPath', config.root + '/public');
    app.use(morgan('dev'));
  }

  if ('development' === env || 'test' === env) {
    app.use(require('connect-livereload')({
      src: 'http://localhost:35729/livereload.js?snipver=1'
    }));
    app.use('/labs/labs/', express.static(path.join(config.root, '.tmp')));
    app.use('/labs/labs/', express.static(path.join(config.root, 'client')));
    app.set('appPath', 'client');
    app.use(morgan('dev'));
    app.use(errorHandler());
  }
};
