var _ = require('underscore'); 
var routing = require('./routes');
var apifile = require('./api');
var indexfile = require('./index');

function swagger(app, options) {
  var routesMap = [];
  var routes = [];
  
  if (app.routes.get) routes = routes.concat(app.routes.get);
  if (app.routes.put) routes = routes.concat(app.routes.put);
  if (app.routes.post) routes = routes.concat(app.routes.post);
  if (app.routes.delete) routes = routes.concat(app.routes.delete);

  routes.forEach(function(route){
    var parts = route.path.split('/');
    var filename = parts[1];

    if (parts.length > 3 && parts[2].indexOf(':') == -1) filename = filename + parts[2];
    if (parts.length > 3 && parts[3].indexOf(':') == -1) filename = filename + parts[3];

    routesMap.push({ filename : filename, path : route.path, method : route.method });
  });

  var models = _.uniq(_.pluck(routesMap, 'filename'));
  var routesGrouped = _.groupBy(routesMap, function(item){ return item.filename; });

  apifile(models, routesGrouped, options.resources, options.validation);
  indexfile(models, options.resources);
  routing(app, options);
}

module.exports = swagger;