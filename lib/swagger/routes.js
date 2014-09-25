var express = require('express')
, path = require('path');

var swaggerRoutes = function(app, config) {
  app.use('/', express.static(process.cwd() + config.statics));

  app.get('/api-docs.json', function (req, res, next) {
    var models = require(path.join(process.cwd(), config.resources) + 'index.json');
    models.basePath = config.applicationUrl;
    res.status(200).json(models);
  });

  app.get('/api-docs.json/:resource', function (req, res, next) {
    var models = require(path.join(process.cwd(), config.resources) + req.params.resource + '.json');
    models.basePath = config.applicationUrl;
    res.status(200).json(models);
  });

  app.get(/^\/swagger(\/.*)?$/, function (req, res, next) {
    var model = {
      title: config.title,
      applicationUrl: config.applicationUrl + '/api-docs.json'
    };

    res.render(process.cwd() + config.statics + 'index', model);
  });
};

module.exports = swaggerRoutes;