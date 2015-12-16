'use strict';

/**
This is just a dummy webserver written in Node.js to test the
front end without needing a proper back end implementation.
It will respond with 3 dummy suggestions.
*/

var http = require('http');

var server = new http.Server();
server.on('request', function(req, res) {
  console.log(req.url);
  var params = require('url').parse(req.url, true).query;
  
  res.end('["' + params.word + '1", "' + params.word + '2", "' + params.word + '3"]');
});
server.listen(3500);
