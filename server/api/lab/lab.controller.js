'use strict';

var _ = require('lodash');
var Q = require('q');
var Lab = require('./lab.model');
var config = require('../../config/environment');

function filterLabs(myLang, labs) {
  if (myLang === 'en') {
    return;
  }
  _.remove(labs, function(obj, i, arr) {
    if (obj.lang === 'en') {
      return _.find(arr, function(tmp_obj) {
        if (tmp_obj.lang === myLang && tmp_obj.lab_id === obj.lab_id) {
          tmp_obj.featured = obj.featured;
          return true;
        }
      });
    }
    return false;
  });
}

function _save(lab_id, lab) {
  var deferred = Q.defer();
  var data = {
    featured: lab.featured,
    mostViewed: lab.mostViewed
  }
  Lab.update({
    lab_id: lab_id
  }, data, {
    upsert: true
  }, deferred.resolve);
  return deferred.promise;
}

function upsertLabs(labs) {
  var deferred = Q.defer();
  var deferredList = [];
  for (var key in labs) {
    deferredList.push(_save(key, labs[key]));
  }

  Q.all(deferredList).then(function() {
    deferred.resolve();
  });
  return deferred.promise;
}

function handleError(res, err) {
  return res.send(500, err);
}

function getLabs(lang, cb) {
  var langs = {
    en: 'en'
  };
  langs[lang] = lang;

  Lab.find({
    lang: {
      $in: Object.keys(langs)
    }
  }, '-_id')
    .lean()
    .exec(function(err, labs) {
      if (err) {
        return cb(err);
      }
      filterLabs(lang, labs);
      cb(null, labs);
    });
}

// Get list of labs
exports.index = function(req, res) {
  getLabs(req.cookies.rh_locale, function(err, labs) {
    if (err) {
      return handleError(res, err);
    }
    if (req.get('Content-Type') === 'application/json') {
      return res.json(labs);
    }

    res.render('index', {
      labs: labs
    });
  });
};

exports.update = function(req, res) {
  // Have to be
  // 1) Authorized
  // 2) Internal
  // 3) Whitelisted
  if ((!req.authorized || !req.authorized.internal) || config.whitelist.indexOf(req.authorized.login) === -1) {
    return res.status(401).end();
  }
  upsertLabs(req.body).then(function() {
    getLabs(req.cookies.rh_locale, function(err, labs) {
      if (err) {
        return handleError(res, err);
      }
      res.json(labs);
    });
  });
};
