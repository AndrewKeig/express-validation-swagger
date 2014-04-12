var _ = require('underscore')
, routing = require('./routes')
, apifile = require('./api')
, indexfile = require('./index');

function swagger(app, options) {
  if (!options.title) throw new Error('Please provide a title');
  if (!options.statics) throw new Error('Please specify the location of the swagger ui');
  if (!options.resources) throw new Error('Please sepecify where you would like to store your swagger resources');
  if (!options.applicationUrl) throw new Error('Please specify the url which hosts your swagger resources');
  if (!options.routes) throw new Error('Please provide a list of routes to swagger enable');

  options.routes.forEach(function(route){
    if (!route.page) throw new Error('Please provide a page for route', route);
    if (!route.method) throw new Error('Please provide a method for route', route);
    if (!route.path) throw new Error('Please provide a path for route', route);
  });

  apifile(options.routes, options.resources);
  indexfile(options.routes, options.resources);
  routing(app, options);
}

module.exports = swagger;