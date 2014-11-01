'use strict';

var express = require('express'),
    utils = require('rh-node-utils'),
    Lab = require('../models/lab'),
    Q = require('q'),
    router = express.Router();

function _save(lab_id, data) {
    var deferred = Q.defer();
    Lab.update({
        lab_id: lab_id
    }, data, {
        upsert: true
    }, deferred.resolve);
    return deferred.promise;
}

function upsert_labs(labs) {
    var deferred = Q.defer();
    var deferredList = [];
    for (var lab_id in labs) {
        deferredList.push(_save(lab_id, labs[lab_id]));
    }

    Q.all(deferredList).then(function() {
        deferred.resolve();
    });
    return deferred.promise;
}

module.exports = function(app) {
    app.use('/labs', router);
};

router.post('/labs/', utils.auth(), function(req, res, next) {
    if (req.authorized && req.authorized.internal) {
        upsert_labs(req.body).then(function() {
            res.status(200).end();
        });
    } else {
        res.status(401).end();
    }
});
