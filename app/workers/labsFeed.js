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
        url: 'https://access.devgssci.devlab.phx1.redhat.com/feeds/labinfo',
        strictSSL: false
    }, function(error, response, body) {
        debugger;
        if (!error && response.statusCode === 200) {
            var parsedLabs = [];
            parse(body)
                .then(function(labs) {
                    labs.forEach(function(lab) {
                        var lang = lab.lang;
                        if (lang === 'zh-hans') {
                            lang = 'zh_CN';
                        }
                        parsedLabs.push({
                            id: (lab.id + '_' + lang),
                            name: lab.title,
                            lab_id: lab.id,
                            description: lab.description,
                            version: lab.version,
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
