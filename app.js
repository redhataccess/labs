/*global require*/
'use strict';
var express = require('express'),
    config  = require('./config/config'),
    app     = express();

// Init DB connection and require models
require('./db');
require('./config/express')(app, config);

app.listen(config.port, config.ip);
