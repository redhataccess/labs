/**
 * Main application routes
 */

'use strict';

module.exports = function(app) {

  // Insert routes below
  app.use('/', require('./api/lab'));
  app.use('/labs/', require('./api/lab'));

  // All undefined asset or api routes should return a 404
  app.route('/labs/:url(api|auth|components|app|bower_components|assets)/*')
    .get(function(req, res) {
      res.status(404).end();
    });

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.render('index');
    });
};
