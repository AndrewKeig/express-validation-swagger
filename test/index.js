var assert = require('assert')
 , RestSupport = require('./support');

describe('swagger api', function(){
  describe('when requesting swagger', function(){
    var me = this;
    var body, response, statusCode;
    var url = 'http://127.0.0.1:3000/';

    it('should respond with 200', function(done){
      RestSupport.get(url + 'swagger', function(err, body, response){
        console.log(err);
        body = body;
        response = response;
        statusCode = response.statusCode;
        assert.equal(200, statusCode);
        done();
      });
    });
  });

  describe('when requesting swagger api-docs.json', function(){
    var me = this;
    var body, response, statusCode;
    var url = 'http://127.0.0.1:3000/';

    it('should respond with 200', function(done){
      RestSupport.get(url + 'api-docs.json', function(err, body, response){
        body = body;
        response = response;
        statusCode = response.statusCode;
        assert.equal(200, statusCode);
        done();
      });
    });
  });

  describe('when requesting swagger api-docs.json/user', function(){
    var me = this;
    var body, response, statusCode;
    var url = 'http://127.0.0.1:3000/';

    it('should respond with 200', function(done){
      RestSupport.get(url + 'api-docs.json/user', function(err, body, response){
        body = body;
        response = response;
        statusCode = response.statusCode;
        assert.equal(200, statusCode);
        done();
      });
    });
  });
});
