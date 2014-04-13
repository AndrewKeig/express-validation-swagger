var express = require('express')
  , cons = require('consolidate')
  , http = require('http')
  , swagger = require('../lib/swagger/main')
  , validate = require('express-validation')
  , Joi = require('joi')
  , app = express();

app.engine('html', cons.handlebars);
app.set('view engine', 'html');
app.set('views', 'public');

var validation = { 
  user : { 
    get : { 
      headers: { userid : Joi.string().required().regex(/^[0-9a-fA-F]{24}$/) }
    },
    post : { 
      headers: { userid : Joi.string().required().regex(/^[0-9a-fA-F]{24}$/) }
      , body: { username : Joi.string().required() }
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
      res.json(200, user);
    },
    post : function (req, res, next) {
      var user = { "userId" : "530d1d22be018c1121025be1", "name" : "airasoul" };
      res.json(201, user);
    },
    del : function (req, res, next) {
      var user = { "userId" : "530d1d22be018c1121025be1", "name" : "airasoul" };
      res.json(204, user);
    },
    put : function (req, res, next) {
      var user = { "userId" : "530d1d22be018c1121025be1", "name" : "airasoul" };
      res.json(204, user);
    }
  }
}

app.get('/user', validate(validation.user.get),  services.user.get);
app.post('/user', validate(validation.user.post),  services.user.post );
app.del('/user', validate(validation.user.del),   services.user.del);
app.put('/user', validate(validation.user.put),   services.user.put);

swagger(app, {
  title : 'express validation swagger', 
  statics : '/test/public/swagger/',  
  resources : '/test/swagger/', 
  applicationUrl : 'http://127.0.0.1:3000',
  routes : [
    { page : 'user', method : 'GET',    path: '/user',         validation : validation.user.get },
    { page : 'user', method : 'POST',   path: '/user',         validation : validation.user.post },
    { page : 'user', method : 'DELETE', path: '/user',         validation : validation.user.del },
    { page : 'user', method : 'PUT',    path: '/user',         validation : validation.user.put }
  ]
});

app.use(app.router);
http.createServer(app).listen(3000);
module.exports = app;