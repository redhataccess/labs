'use strict';

var path = require('path');
var _ = require('lodash');

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // Server port
  port: process.env.PORT || 9000,

  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },

  whitelist: [
    'rhn-support-ahecox',
    'rhn-support-chindley',
    'rhn-support-dvarga',
    'rhn-support-iphands',
    'rhn-support-kroberts'
  ]

};

// Setting auth domains for non prod environments
var ns = process.env.OPENSHIFT_NAMESPACE;
if (!ns || ns !== 'labsprod') {
  process.env.COOKIE_AUTH_DOMAIN = 'https://access.devgssci.devlab.phx1.redhat.com';
  process.env.COOKIE_AUTH_URL = 'https://access.devgssci.devlab.phx1.redhat.com/services/user/status?jsoncallback=';
}

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./' + process.env.NODE_ENV + '.js') || {});
