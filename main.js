var http = require('http');
var url = require('url');

var key = '2654c7e8967d5b240b860d9cb18f9b9e';

var app = http.createServer(function (req, res1) {
  console.log(req.url)
  var url_parts = url.parse(req.url, true);
  var search = url_parts.query.search
  search = search.split("+")
  var songs = []
  var c = 0
  for(var i = 0; i<search.length; i++){
    
    get_song(res1,search[i], function (song) {
      songs.push(song)
      c++
    })
  }

  while (c < songs.length) {}

  req.end(songs)

  
});

function get_song(result, search, cb) {
  var buffer = ''
  var tiny = http.get("http://tinysong.com/b/"+search+"?format=json&key="+key,function(res){
    res.on('data',function(data){
      buffer+=data
    });  
    res.on('end',function(){
      cb(JSON.parse(buffer).SongName)
    });
  });
}

app.listen(6002);

