/*global require*/
'use strict';
var express = require('express'),
    config  = require('./config/config'),
    app     = express();

// Init DB connection and require models
require('./db');
require('./config/express')(app, config);

process.env.COOKIE_AUTH_DOMAIN = 'https://access.devgssci.devlab.phx1.redhat.com';
process.env.COOKIE_AUTH_URL = 'https://access.devgssci.devlab.phx1.redhat.com/services/user/status?jsoncallback=';
app.listen(config.port, config.ip);
