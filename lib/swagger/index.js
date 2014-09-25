var path = require('path') 
, _ = require('lodash') 
, jsonFile = require('json-file-plus')
, utils = require('./utils');

var indexfile = function(config){
  var routes = _.uniq(_.pluck(config.routes, 'route'));
  var template = path.join(__dirname, '/templates/index.json');
  var apis = [];

  routes.forEach(function(route){
    apis.push({
      path: "/api-docs.json/" + route,
      description: utils.capitalise(route) + " API"
    });
  });

  jsonFile(template, function (err, file) {
    if (err) console.log(err);
    file.set({ apiVersion: config.version || '0.0.1' }); 
    file.set({ swaggerVersion: '1.2.5' }); 
    file.set({ apis: apis }); 
    file.filename = path.join(process.cwd(), config.resources + '/index.json');
    file.save();
  });
};

module.exports = indexfile;