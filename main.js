var http = require('http');
var url = require('url');

var key = '2654c7e8967d5b240b860d9cb18f9b9e';

var app = http.createServer(function (req, res1) {
  console.log(req.url)
  var url_parts = url.parse(req.url, true);
  var search = url_parts.query.search;
  var buffer = ''
  var tiny = http.get("http://tinysong.com/b/"+search+"?format=json&key="+key,function(res){
    res.on('data',function(data){
      buffer+=data
    });  
    res.on('end',function(){
     // console.log(buffer) 
      res1.end(JSON.parse(buffer).SongName)
    });
  });  
});

app.listen(6002);

