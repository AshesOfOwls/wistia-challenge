var express = require('express');
var app = express();

app.use(express.static('public'));

app.get("/dashboard", function (request, response) {
  response.sendFile(__dirname + '/public/dashboard.html');
});

app.get("/playlist", function (request, response) {
  response.sendFile(__dirname + '/public/playlist.html');
});

var listener = app.listen(4000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
