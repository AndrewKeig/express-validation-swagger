var request = require('request');

var RestSupport = function() {

  RestSupport.prototype.get = function(resource, next) {
    var me = this;
    
    request({
      url: resource,
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      }
    }, function (err, res, body) {
      if (err) return next(err);
      next(err, body, res);
    });
  };
};

module.exports = new RestSupport();