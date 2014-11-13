#!/usr/bin/env node

'use strict';

var xml2js = require('xml2js'),
  request = require('request'),
  Q = require('q'),
  mongoose = require('mongoose');

var config = require('./config/environment');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);
var Lab = require('./api/lab/lab.model');

function parse(xml) {
  var deferred = Q.defer();
  // Parse out retrieved xml
  // explicitArray:false tells the parser to only glob things
  // into arrays if there is more than one.
  xml2js.parseString(xml, {
    explicitArray: false,
    trim: true
  }, function(err, result) {
    if (result && result.rss && result.rss.channel && result.rss.channel.item) {
      deferred.resolve(result.rss.channel.item);
    } else {
      deferred.reject();
    }
  });
  return deferred.promise;
}

function _save(lab) {
  var deferred = Q.defer();
  Lab.update({
    id: lab.id
  }, lab, {
    upsert: true
  }, deferred.resolve);
  return deferred.promise;
}

function save(labs) {
  var deferredList = [];
  labs.forEach(function(lab) {
    deferredList.push(_save(lab));
  });

  Q.all(deferredList).then(function() {
    console.log('All finished - Upserted ' + labs.length + ' documents');
    process.exit(0);
  });
}

function fetch() {
  var deferred = Q.defer();
  request.get({
    url: 'https://access.redhat.com/feeds/labinfo'
  }, function(error, response, body) {
    console.log('request finished - ', response.statusCode);
    if (!error && response.statusCode === 200) {
      var parsedLabs = [];
      parse(body)
        .then(function(labs) {
          labs.forEach(function(lab) {
            if (lab.id === 'dockerhelper') {
              // Temp hack for dockerhelper
              return;
            }
            var lang = lab.lang;
            if (lang === 'zh-hans') {
              lang = 'zh_CN';
            }
            parsedLabs.push({
              id: (lab.id + '_' + lang),
              name: lab.title,
              lab_id: lab.id,
              description: lab.description,
              version: lab.version === 'Unknown' ? null : lab.version,
              type: lab.type,
              lang: lang
            });
          });
          deferred.resolve(parsedLabs);
        });
    }
  });
  return deferred.promise;
}

fetch().then(save);
