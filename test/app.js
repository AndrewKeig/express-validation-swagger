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
    } 
  }
};

app.get('/user', validate(validation.user.get),  function (req, res, next) {
  var user = { "userId" : "530d1d22be018c1121025be1", "name" : "airasoul" };
  res.json(200, user);
});

swagger(app, {
  title : 'express validation swagger', 
  statics : '/test/public/swagger/',  
  resources : '/test/swagger/', 
  applicationUrl : 'http://127.0.0.1:3000',
  validation : validation
});

app.use(app.router);
http.createServer(app).listen(3000);
module.exports = app;