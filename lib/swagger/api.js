var jsonFile = require('json-file-plus')
, path = require('path')
, url = require('url') 
, _ = require('lodash')
, utils = require('./utils')
, indexfile = require('./index');

var createParametersAndModels = function(validation, name, method){
  if (!validation) return [];
  var parameters = [];
  var models = {};

  if (validation.params !== undefined) {
    var paramskeys = Object.keys(validation.params);

    for (var pkey in paramskeys) {
      var pvkey = paramskeys[pkey];
      var pvitem = validation.params[pvkey];
      if (pvitem._type === "boolean") pvitem._type = "Bool";
            
      var pitem = {
        name: pvkey,
        description: pvkey,
        paramType: "path",
        required: true,
        dataType: utils.capitalise(pvitem._type)
      };

      parameters.push(pitem);
    }
  }

  if (validation.headers !== undefined) {
    var headerskeys = Object.keys(validation.headers);

    for (var hkey in headerskeys) {
      var hvkey = headerskeys[hkey];
      var hvitem = validation.headers[hvkey];
      if (hvitem._type === "boolean") hvitem._type = "Bool";

      var hitem = {
        name: hvkey,
        description: hvkey,
        paramType: "header",
        required: true,
        dataType: utils.capitalise(hvitem._type)
      };

      parameters.push(hitem);
    }
  }

  if (validation.body !== undefined) {

    var bodykeys = Object.keys(validation.body);
    var items = {};

    for (var bkey in bodykeys) {
      var bvkey = bodykeys[bkey];
      var bvitem = validation.body[bvkey];

      if (bvitem._type === "boolean") bvitem._type = "Bool";

      var bit = {};
      bit[bvkey] = { type : utils.capitalise(bvitem._type) };
      items[bvkey] = bit[bvkey];
    }

    if (items) models = { properties : items };
    
    var model = {
      name: 'body',
      description: utils.capitalise(name),
      paramType: "body",
      required: true,
      dataType: utils.capitalise(name) + utils.capitalise(method)
    };

    parameters.push(model);
  }

  if (validation.query !== undefined) {
    var querykeys = Object.keys(validation.query);

    for (var qkey in querykeys) {
      var qvkey = querykeys[qkey];
      var qvitem = validation.query[qvkey];

      if (qvitem._type === "boolean") qvitem._type = "Bool";
            
      var qitem = {
        name: qvkey,
        description: qvkey,
        paramType: "query",
        required: true,
        dataType: utils.capitalise(qvitem._type)
      };

      parameters.push(qitem);
    }
  }

  return { parameters : parameters, models : models};
};

var createApis = function(model){
  var apis = [];
  var models = {};

  model.forEach(function(route){
    var response = createParametersAndModels(route.validation, route.path, route.method);
    var path = route.path;
    
    if (route.path.indexOf(':') !== -1) path = route.path.replace(':','{') + '}';

    var operation = {
      path: path,
      operations: [{
        httpMethod: route.method.toUpperCase(),
        summary: route.options && route.options.description ? route.options.description : "An api for " + route.method + ' ' + route.route,
        nickname: utils.capitalise(route.route),
        consumes: route.options && route.options.consumes ? route.options.consumes : [ "application/json" ],
        produces: route.options && route.options.produces ? route.options.produces : [ "application/json" ],
        parameters : response.parameters,
        responseMessages: route.options && route.options.responseMessages ? route.options.responseMessages : []
      }]
    };

    if (!_.isEmpty(response.models)) models[utils.capitalise(route.path) + utils.capitalise(route.method)] = response.models;
    apis.push(operation);
  });

  return { apis : apis, models : models};
};

var apifile = function(config){
  
  var routes = _.uniq(_.pluck(config.routes, 'route'));

  routes.forEach(function(route){
    var routeForPage = _.filter(config.routes, function(item){ return item.route == route; });

    var response = createApis(routeForPage);
    var template = path.join(__dirname, '/templates/api.json');
    var version = config.options && config.options.version  ? config.options.version : '0.0.1' ;

    jsonFile(template, function (err, file) {
      if (err) console.log(err);
      file.set({ apiVersion: version }); 
      file.set({ swaggerVersion: '1.2.5' }); 
      file.set({ apis:  response.apis }); 
      file.set({ models: response.models }); 
      file.filename = path.join(process.cwd(), config.resources + route + '.json');
      file.save();
    });
  });
};

module.exports = apifile;