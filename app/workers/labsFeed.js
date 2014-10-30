#!/usr/bin/env node

'use strict';

var xml2js = require('xml2js'),
  request = require('request'),
  Q = require('q'),
  mongoose = require('mongoose');

// Init DB connection and require models
require('../../db');
var Lab = mongoose.model('Lab');

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

function save(labs) {
  // Clear out existing labs
  Lab.collection.remove({}, function(err) {
    if (err) {
      // I don't know how this would happen.
      console.log('Error dropping collection?');
      process.exit(1);
      return;
    }
    // so far so good
    console.log('Labs dropped.');
    // Bulk insert our labs
    Lab.collection.insert(labs, function(err, labs) {
      if (err) {
        // Failboat
        console.log('Error saving labs?');
        process.exit(1);
      }
      // All good.
      console.log('Collection saved! Stored ' + labs.length + ' labs in the DB.');
      process.exit(0);
    });
  });
}

function all() {
  var deferred = Q.defer();
  request.get({
    url: 'https://access.devgssci.devlab.phx1.redhat.com/feeds/labinfo',
    strictSSL: false
  }, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var parsedLabs = [];
      parse(body)
        .then(function(labs) {
          labs.forEach(function(lab) {
            parsedLabs.push({
              name: lab.title,
              lab_id: lab.id,
              description: lab.description,
              version: lab.version,
              type: lab.type,
              featured: lab.featured,
              lang: lab.lang,
              mostViewed: lab.featured
            });
          });
          deferred.resolve(parsedLabs);
        });
    }
  });
  return deferred.promise;
}

all().then(save);
