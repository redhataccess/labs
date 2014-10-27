#!/usr/bin/env node

'use strict';

var xml2js = require('xml2js'),
  request = require('request'),
  Q = require('q'),
  mongoose = require('mongoose');

// Init DB connection and require models
require('../../db');
var Lab = mongoose.model('Lab');
var allLabs = [],
  featuredLabs = [];

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

function save() {
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
    Lab.collection.insert(allLabs, function(err, labs) {
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

function featured() {
  var deferred = Q.defer();
  request.get({
    url: 'https://access.redhat.com/feeds/labinfo/featured',
    strictSSL: false
  }, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      parse(body)
        .then(function(labs) {
          labs.forEach(function(lab) {
            featuredLabs.push(lab.title);
          });
          deferred.resolve();
        });
    }
  });
  return deferred.promise;
}

function all() {
  var deferred = Q.defer();
  request.get({
    url: 'https://access.redhat.com/feeds/labinfo',
    strictSSL: false
  }, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      parse(body)
        .then(function(labs) {
          labs.forEach(function(lab) {
            // Our parsing of each lab
            var matches = lab.link.match(/\/labsinfo\/(.*?)%/);
            var lab_id = matches && matches[1],
              title = lab.title,
              featured = (featuredLabs.indexOf(title) !== -1);
            allLabs.push({
              name: title,
              lab_id: lab_id,
              description: lab.description,
              version: lab.pubDate,
              type: lab['dc:creator'],
              isFeatured: featured
            });
          });
          deferred.resolve();
        });
    }
  });
  return deferred.promise;
}

featured().then(all).then(save);
