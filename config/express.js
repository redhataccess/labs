'use strict';
var express = require('express');
var glob = require('glob');

var logger = require('morgan');
var compress = require('compression');

module.exports = function(app, config) {
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'jade');

  app.use(logger('dev'));
  app.use(compress());
  app.use(express.static(config.root + '/public'));
  app.use('/labs/labs', express.static(config.root + '/public', { maxAge: 432000 }));

  // Pull in controllers
  glob.sync(config.root + '/app/controllers/*.js').forEach(function(controller) {
    require(controller)(app);
  });

  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  if (app.get('env') === 'development') {
    app.use(function(err, req, res) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err,
        title: 'error'
      });
    });
  }

  app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {},
      title: 'error'
    });
  });

};
