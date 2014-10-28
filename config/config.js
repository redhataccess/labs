'use strict';
var path = require('path'),
  rootPath = path.normalize(__dirname + '/..'),
  env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'labs'
    },
    ip: '127.0.0.1',
    port: 9000,
    db: 'mongodb://localhost/labs-development'

  },

  test: {
    root: rootPath,
    app: {
      name: 'labs'
    },
    ip: '127.0.0.1',
    port: 9000,
    db: 'mongodb://localhost/labs-test'

  },

  production: {
    root: rootPath,
    app: {
      name: 'labs'
    },
    ip: process.env.OPENSHIFT_NODEDIY_IP,
    port: process.env.OPENSHIFT_NODEDIY_PORT,
    db: process.env.OPENSHIFT_MONGODB_DB_URL+process.env.OPENSHIFT_APP_NAME || 'mongodb://localhost/labs-production'

  }
};

module.exports = config[env];
