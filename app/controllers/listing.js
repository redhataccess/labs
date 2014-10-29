'use strict';

var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Lab = mongoose.model('Lab');

var isDev = false;
module.exports = function(app) {
  if (app.get('env') === 'development') {
    isDev = true;
  }
  app.use('/', router);
};

router.get('/labs/', function(req, res, next) {
  Lab.find(function(err, labs) {
    if (err) return next(err);
    if (req.get('Content-Type') === 'application/json') {
      return res.json(labs);
    }
    var featured = labs.filter(function(lab) {
      return lab.featured;
    });
    var isAdmin = (typeof req.query.admin !== 'undefined');
    res.render('index', {
      title: 'Labs - Red Hat Customer Portal',
      featured: featured,
      labs: labs,
      isAdmin: isAdmin,
      isDev: isDev
    });
  });
});
