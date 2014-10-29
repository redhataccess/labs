'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var LabSchema = new Schema({
  name: String,
  lab_id: String,
  version: String,
  type: String,
  description: String,
  lang: String,
  featured: {
    type: Boolean,
    default: false
  },
  mostViewed: {
    type: Boolean,
    default: false
  }
});

mongoose.model('Lab', LabSchema);
