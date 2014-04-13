express-validation-swagger
==================

express-validation-swagger generates a swagger enabled client, using express-validation to define the rules around API parameters (api payload).  express-validation can be configured to validate those rules.


####### note: very much a work-in-progress, but unlike the previous version; this one works..

## install

### install express-validation-swagger

```npm install express-validation-swagger ```


####  install express-validation

In order to validate your routes and define the parameters and payload for your API, install [express-validation](https://www.npmjs.org/package/express-validation "express-validation")


```npm install express-validation ```


### install swagger-ui
You will need to install the swagger client; which contains the html pages that supprt a swagger api [swagger-ui](https://www.npmjs.org/package/swagger-ui "swagger-ui")


```npm install swagger-ui ```

## setup

### add swagger to your express application

1. `title` is the name given to th swagger web site
2. `statics` is the location of the swagger-ui client files
3. `resources` is the location of your generated swagger resource files
4. `applicationUrl` is the url of your application, this is inserted into the swagger client (see below)
5. `routes` contains an array of routes (see below)
 
```
var swagger = require('express-validation-swagger');

swagger(app, {
  title : 'express validation swagger', 
  statics : '/test/public/swagger/',  
  resources : '/test/swagger/', 
  applicationUrl : 'http://127.0.0.1:3000',
  routes : [
    { page : 'user', method : 'GET',    path: '/user', validation : validation.user.get },
    { page : 'user', method : 'POST',   path: '/user', validation : validation.user.post },
    { page : 'user', method : 'DELETE', path: '/user', validation : validation.user.del },
    { page : 'user', method : 'PUT',    path: '/user', validation : validation.user.put }
  ]
});
```


### swagger-ui template changes

In order to specify where to host swagger amend the swagger index.html file, the `url` element should equal `{{applicationUrl}}`.

```
$(function () {
  window.swaggerUi = new SwaggerUi({
  url: "{{applicationUrl}}",
  dom_id: "swagger-ui-container",
  supportedSubmitMethods: ['get', 'post', 'put', 'delete'],
  onComplete: function(swaggerApi, swaggerUi){
    if(console) {
      console.log("Loaded SwaggerUI")
    }
    $('pre code').each(function(i, e) {hljs.highlightBlock(e)});
  },
  onFailure: function(data) {
    if(console) {
      console.log("Unable to Load SwaggerUI");
      console.log(data);
    }
  },
  docExpansion: "none"
});

```


### add express-validation rules
Simply define a collection of rules; like so; more info here: [express-validation](https://www.npmjs.org/package/express-validation "express-validation")

```
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
```

##  complete example

Here is a full listing; we also include handlebars so that we can set the ```applicationUrl``` in our ```test/public/swagger/index.html``` file.   The source code contains a working example.

Simply run: 

```
npm install
node test/app.js
```


```
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
    { page : 'user', method : 'GET',    path: '/user', validation : validation.user.get },
    { page : 'user', method : 'POST',   path: '/user', validation : validation.user.post },
    { page : 'user', method : 'DELETE', path: '/user', validation : validation.user.del },
    { page : 'user', method : 'PUT',    path: '/user', validation : validation.user.put }
  ]
});

app.use(app.router);
http.createServer(app).listen(3000);
module.exports = app;

```


## run test
Start the express application:

```node test/app.js```

Now run the tests:

```grunt test```
