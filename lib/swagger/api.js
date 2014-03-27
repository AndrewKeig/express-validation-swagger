var jsonFile = require('json-file-plus');
var path = require('path'); 
var url = require('url'); 
var _ = require('underscore'); 
var utils = require('./utils');
var indexfile = require('./index');

var getErrors = function(){
  var errors = [
    {
      code: 401,
      reason: "Unauthorised"
    },
    {
      code: 400,
      reason: "Bad request"
    },
    {
      code: 404,
      reason: "Not Found"
    },
    {
      code: 500,
      reason: "An internal server error"
    }
  ];
};

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
      name: utils.capitalise(name) + utils.capitalise(method),
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

var createApis = function(routes, validation){
  var apis = [];
  var models = {};
    
  routes.forEach(function(route){

    var validationForVerb;

    var method = route.method;
    if (route.method == 'delete') method = 'del';

    if (validation) validationForVerb = validation[method];

    var response = createParametersAndModels(validationForVerb, route.filename, route.method);

    var path = route.path;
    if (route.path.indexOf(':') !== -1) path = route.path.replace(':','{') + '}';

    var operation = {
      path: path,
      operations: [{
        httpMethod: route.method.toUpperCase(),
        summary: "An api for " + route.method + ' ' + route.filename,
        nickname: utils.capitalise(route.method) + utils.capitalise(route.filename),
        consumes: [
          "application/json"
        ],
        produces: [
          "application/json"
        ],
        parameters : response.parameters,
        errorResponses: getErrors()
      }]
    };

    if (!_.isEmpty(response.models)) models[utils.capitalise(route.filename) + utils.capitalise(route.method)] = response.models;
    apis.push(operation);
  });

  return { apis : apis, models : models};
};

var apifile = function(models, routes, resources, validation){
  
  models.forEach(function(route){
    var response = createApis(routes[route], validation[route]);
    var template = path.join(__dirname, '/templates/api.json');

    jsonFile(template, function (err, file) {
      if (err) console.log(err);

      file.set({ apiVersion: '0.0.1' }); 
      file.set({ swaggerVersion: '1.2.5' }); 
      file.set({ apis:  response.apis}); 
      file.set({ models: response.models }); 
      file.filename = path.join(process.cwd(), resources + route + '.json');
      file.save();
    });
  });
};

module.exports = apifile;