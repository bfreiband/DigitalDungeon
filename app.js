var twilio = require('twilio'),
client = twilio('***REMOVED***','***REMOVED***');
var Firebase = require('firebase'),
usersRef = new Firebase('https://shining-inferno-3310.firebaseio.com/users/');
var express = require('express'),
bodyParser = require('body-parser'),
app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

usersRef.on('child_added', function(snapshot) {
	console.log(snapshot.val());
})

app.post('/message', function(req, res) {
	var resp = new twilio.TwimlResponse();
	if(req.body.Body == "Let's play a game!")
	{
		usersRef.child(req.body.From).set({
			xCoord: -1,
			yCoord: -1,
			perComplete: -1,
			redbull: -1,
			swag: -1,
			gameOn: true,
			sentText: req.body.Body
		})
	}

	.$getScript("game.js", function(xCoord, yCoord, redbull, swag, perComplete, gameOn, sentText){

	})

	resp.message("Vim is shittttttttttt");
	res.writeHead(200, {
		'Content-Type':'text/xml'
	});
	res.end(resp.toString());
});

var server = app.listen(4567, function() {
	console.log('Listening on port %d', server.address().port);
});
