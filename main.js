var http = require('http');
var url = require('url');
var async = require('async');

var key = '2654c7e8967d5b240b860d9cb18f9b9e';

function sortByKey(array, key) {
    return array.sort(function(a, b) { 
        var x = a[key];
        var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

var app = http.createServer(function (req, res) {
  var url_parts = url.parse(req.url, true);
  var search = url_parts.query.search;

  if(!search) {
    res.end('error');
    return;
  }

  var words = search.split(" ")
  var i = 0;
  words.forEach(function (word) {
    words[i++] = {i: i, word: word};
  });
  console.log(words)

  var songs = [];

  async.each(words, function (word, cb) {
    get_song(res, word.word, function (song) {
      songs.push({song: song, i: word.i});
      cb();
    })
  }, function (err) {
    if (err) {
      console.log('err');
      return;
    }

    console.log(songs)

    var out = '';
    songs = sortByKey(songs, 'i');
    songs.forEach(function(song){
      out += song.song + '\n';
    });
    res.end(out);
  });

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

