express-validation-swagger
==================

express-validation-swagger generates a swagger enabled client using simple conventions.  


## install

```npm install express-validation-swagger ```


## install express-validation

In order to validate your routes install [express-validation](https://www.npmjs.org/package/express-validation "express-validation")


```npm install express-validation ```


## install swagger-ui
You will need to install the swagger client [swagger-ui](https://www.npmjs.org/package/swagger-ui "swagger-ui")


```npm install swagger-ui ```


## add swagger to your express application

1. title is the name given to th swagger web site
2. statics is the location of the swaggerui client files
3. is the location of your generated swagger resources
4. applicationUrl is the url of your application, this is inserted into the swagger client (see below)
5. validation contains an array of validation blocks
 
```

var swagger = require('express-validation-swagger');

swagger(app, {
  title : 'express validation swagger', 
  statics : '/public/docs/swagger_ui/',  
  resources : '/lib/swagger/', 
  applicationUrl : 'http://127.0.0.1:3000',
  validation : validation
});
```


## swaggerui template changes

In order to specify where to host swagger amend the swagger index.html file, the `url` element should equal `{{applicationUrl}}`.


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


## example

Here is a full listing; we also include handlebars so that we can set the ```applicationUrl``` in our ```public/swagger/index.html``` file.   The source code contains a working example.

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

```


## run test
Start the express application:

```node test/app.js```

Now run the tests:

```grunt test```
