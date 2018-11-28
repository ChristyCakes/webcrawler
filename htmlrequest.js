var request = require('request');

// view html
request('https://www.soundtracks.com/', function (error, response, html) {
  if (!error && response.statusCode == 200) {
    console.log(html);
  }
});