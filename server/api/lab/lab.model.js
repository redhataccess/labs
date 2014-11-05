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
    featured: Boolean,
    mostViewed: Boolean
});

module.exports = mongoose.model('Lab', LabSchema);
