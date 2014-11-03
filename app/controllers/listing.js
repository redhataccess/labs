/*global require, module, _*/
'use strict';

var express  = require('express'),
    router   = express.Router(),
    lodash   = require('lodash'),
    Lab      = require('../models/lab'),
    isDev    = false;


module.exports = function(app) {
    if (app.get('env') === 'development') {
        isDev = true;
    }
    app.use('/', router);
};

router.get(['/', '/labs/'], function(req, res, next) {
    var my_lang = req.cookies.rh_locale,
        langs = { en : 'en' };

    langs[my_lang] = my_lang;
    langs[req.cookies.rh_locale] = req.cookies.rh_locale;

    Lab.find({lang: { $in: Object.keys(langs) } }).lean().exec(function(err, labs) {
        if (err) {
            return next(err);
        }

        if (my_lang !== 'en') {
            lodash.remove(labs, function (obj, i, arr) {
                if (obj.lang === 'en') {
                    return lodash.find(arr, function (tmp_obj) {
                        return tmp_obj.lang === my_lang && tmp_obj.lab_id === obj.lab_id;
                    });
                }
                return false;
            });
        }

        if (req.get('Content-Type') === 'application/json') {
            return res.json(labs);
        }

        var featured = labs.filter(function(lab) {
            return lab.featured;
        });
        var mostViewed = labs.filter(function(lab) {
            return lab.mostViewed;
        });

        var isAdmin = (typeof req.query.admin !== 'undefined');

        res.render('index', {
            title: 'Labs - Red Hat Customer Portal',
            featured: featured,
            mostViewed: mostViewed,
            labs: labs,
            isAdmin: isAdmin,
            isDev: isDev
        });

        return null;
    });

    return null;
});
