'use strict';

var express = require('express');
var controller = require('./lab.controller');
var utils = require('rh-node-utils');

var router = express.Router();

router.get('/', controller.index);
router.post('/labs', utils.auth(), controller.update);

module.exports = router;
