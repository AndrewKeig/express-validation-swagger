var path = require('path'); 
var jsonFile = require('json-file-plus');
var utils = require('./utils');

var indexfile = function(pages, resources){
  var template = path.join(__dirname, '/templates/index.json');

  var createApis = function(pages){
    var apis = [];

    pages.forEach(function(page){
      var operation = {
        path: "/api-docs.json/" + page,
        description: utils.capitalise(page) + " API"
      };

      apis.push(operation);
    });

    return apis;
  };

  jsonFile(template, function (err, file) {
    if (err) console.log(err);

    file.set({ apiVersion: '0.0.1' }); 
    file.set({ swaggerVersion: '1.2.5' }); 
    file.set({ apis: createApis(pages) }); 
    file.filename = path.join(process.cwd(), resources + '/index.json');
    file.save();
  });
};

module.exports = indexfile;