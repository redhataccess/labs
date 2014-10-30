/*global require, module*/
'use strict';
var express  = require('express'),
    glob     = require('glob'),
    logger   = require('morgan'),
    compress = require('compression');

module.exports = function(app, config) {
    var oneDay = 86400000;

    app.set('views', config.root + '/app/views');
    app.set('view engine', 'jade');

    app.use(logger('dev'));
    app.use(compress());
    app.use(express.static(config.root + '/public'));
    app.use('/labs/labs', express.static(config.root + '/public', { maxAge: oneDay }));

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
