var http = require('http');

var key = '2654c7e8967d5b240b860d9cb18f9b9e';
var buffer = ''

var app = http.createServer(function (req, res1) {
  var tiny = http.get("http://tinysong.com/b/Girl+Talk+Ask+About+Me?format=json&key="+key,function(res){
    res.on('data',function(data){
      console.log('data') 
      buffer+=data
    });  
    res.on('end',function(){
      console.log('end') 
      res1.end(buffer)
    });
  })  
});

app.listen(6002);

