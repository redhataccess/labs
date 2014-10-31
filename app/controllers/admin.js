'use strict';

var express = require('express'),
    utils = require('rh-node-utils'),
    router = express.Router();

module.exports = function(app) {
    app.use('/labs', router);
};

router.post('/labs/', utils.auth(), function(req, res, next) {
    debugger;
    if (req.authorized && req.authorized.internal) {
        res.status(200).end('Authed.');
    } else {
        res.status(401).end();
    }
});
