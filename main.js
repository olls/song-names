var url = require('url');
var http = require('http');
var bodyParser = require('body-parser');
var express = require('express'),
    app = express(),
	server = require('http').createServer(app);
var async = require('async');
var twilio = require('twilio');

var key = '2654c7e8967d5b240b860d9cb18f9b9e';
var client = new twilio.RestClient('ACa2903cf4c892da6011205748b40bbdb9', 'a812414b8c57237d105cd8b1f672b61a');

function sortByKey(array, key) {
    return array.sort(function(a, b) { 
        var x = a[key];
        var y = b[key];
        return (x < y) ? -1 : ((x > y) ? 1 : 0);
    });
}

app.get('/form', function(req, res) {
  res.send('<form method="post" action="/form"><input name="search"><input type="submit"></form>');
});

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.post('/form', function(req, res) {
  console.log(req.body.search)
  conv(req.body.search,res,  function(out){
  res.send(out);
});
});

app.post('/',function(req,res){
  //var url_parts = url.parse(req.url, true);
  search = req.body.Body;
  number = req.body.From;

  if(!search) {
    res.end('error');
    return;
  }

  conv(search, res,  function( out){
    send(number, out);
    res.end();
  })

});

function conv (search, res, cb) {
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
      out += song.song.SongName + ', ' + song.song.AlbumName + ', ' + song.song.ArtistName + '\n';
    });
    cb(out)
  });

}

function send  (number, msg) {

		client.sms.messages.create({
			to:number,
			from:'+441212853527',
			body: msg
		}, function(error, message) {
			// The HTTP request to Twilio will run asynchronously. This callback
			// function will be called when a response is received from Twilio
			// The "error" variable will contain error information, if any.
			// If the request was successful, this value will be "falsy"
			if (!error) {
				// The second argument to the callback will contain the information
				// sent back by Twilio for the request. In this case, it is the
				// information about the text messsage you just sent:
				console.log('Success! The SID for this SMS message is:');
				console.log(message.sid);
		 
				console.log('Message sent on:');
				console.log(message.dateCreated);
			} else {
				console.log('Oops! There was an error.');
			}
		});
}

function get_song(result, search, cb) {
  var buffer = ''
  var tiny = http.get("http://tinysong.com/b/"+search+"?format=json&key="+key,function(res){
    res.on('data',function(data){
      buffer+=data
    });  
    res.on('end',function(){
      cb(JSON.parse(buffer))
	  });
  });
}

app.listen(6002);

