var http = require('http');

var key = '2654c7e8967d5b240b860d9cb18f9b9e';

var app = http.createServer(function (req, res) {
  res.end('Hello World');
});

app.listen(6002);

