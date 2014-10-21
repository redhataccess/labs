'use strict';

var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Lab = mongoose.model('Lab');

module.exports = function(app) {
  app.use('/', router);
};

router.get('/labs', function(req, res, next) {
  Lab.find(function(err, labs) {
    if (err) return next(err);
    res.render('index', {
      title: 'Labs - Red Hat Customer Portal',
      labs: labs
    });
  });
});
