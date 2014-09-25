var express = require('express')
  , cons = require('consolidate')
  , http = require('http')
  , bodyParser = require('body-parser')
  , swagger = require('../lib/swagger/main')
  , validate = require('express-validation')
  , Joi = require('joi')
  , app = express();

app.engine('html', cons.handlebars);
app.set('view engine', 'html');
app.set('views', 'public');
app.use(bodyParser.json())

var validation = { 
  user : { 
    get : { 
      headers: { userid : Joi.string().required().regex(/^[0-9a-fA-F]{24}$/) }
    },
    post : { 
      headers: { userid : Joi.string().required().regex(/^[0-9a-fA-F]{24}$/) }, 
      body: { username : Joi.string().required() }
    },
    del : { 
      headers: { userid : Joi.string().required().regex(/^[0-9a-fA-F]{24}$/) }
    },
    put : { 
      headers: { userid : Joi.string().required().regex(/^[0-9a-fA-F]{24}$/) }
    }
  }
};

var services = {
  user : {
    get : function (req, res, next) {
      var user = { "userId" : "530d1d22be018c1121025be1", "name" : "airasoul" };
      res.status(200).json(user)
    },
    post : function (req, res, next) {
      var user = { "userId" : "530d1d22be018c1121025be1", "name" : "airasoul" };
      res.status(200).json(user)
    },
    del : function (req, res, next) {
      var user = { "userId" : "530d1d22be018c1121025be1", "name" : "airasoul" };
      res.status(200).json(user)
    },
    put : function (req, res, next) {
      var user = { "userId" : "530d1d22be018c1121025be1", "name" : "airasoul" };
      res.status(200).json(user)
    }
  }
}

app.get('/user', validate(validation.user.get),  services.user.get);
app.post('/user', validate(validation.user.post),  services.user.post );
app.delete('/user', validate(validation.user.del),   services.user.del);
app.put('/user', validate(validation.user.put),   services.user.put);

swagger(app, {
  title : 'swagger api', 
  statics : '/test/public/swagger/',  
  resources : '/test/swagger/', 
  applicationUrl : 'http://127.0.0.1:3000',
  version : '0.1.5',
  routes : [
    { 
      route : 'user', 
      method : 'GET', 
      path: '/user', 
      validation : validation.user.get, 
      options : {
        responseMessages : [
          {code: 500, message: "Internal server error"},
          {code: 400, message: "Bad request" },
          {code: 404, message: "Not found" }
        ],
        description : 'get a user by user id', 
        consumes : ["application/json"],
        produces : ["application/json"]  
      }
    },
    { route : 'user', method : 'POST',   path: '/user', validation : validation.user.post },
    { route : 'user', method : 'DELETE', path: '/user', validation : validation.user.del },
    { route : 'user', method : 'PUT',    path: '/user', validation : validation.user.put }
  ]
});

http.createServer(app).listen(3000);
module.exports = app;