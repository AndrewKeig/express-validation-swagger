var _ = require('lodash')
, routing = require('./routes')
, apifile = require('./api')
, indexfile = require('./index');

function swagger(app, config) {
  if (!config.title) throw new Error('Please provide a title');
  if (!config.statics) throw new Error('Please specify the location of the swagger ui');
  if (!config.resources) throw new Error('Please sepecify where you would like to store your swagger resources');
  if (!config.applicationUrl) throw new Error('Please specify the url which hosts your swagger resources');
  if (!config.routes) throw new Error('Please provide a list of routes to swagger enable');

  config.routes.forEach(function(route){
    if (!route.route) throw new Error('Please provide a route name', route);
    if (!route.method) throw new Error('Please provide a method for route', route);
    if (!route.path) throw new Error('Please provide a path for route', route);
  });

  indexfile(config);
  apifile(config);
  routing(app, config);
}

module.exports = swagger;