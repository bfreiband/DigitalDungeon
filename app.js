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
	var fromNumber = req.body.From;
	var sentText = req.body.Body;

	if(req.body.Body == "Let's play a game!")
	{
		usersRef.child(req.body.From).set({
			xCoord: -1,
			yCoord: -1,
			perComplete: -1,
			redbull: -1,
			swag: -1,
			gameOn: true,
		})
	}

	//Set all of the variables that need to be passed to Max's function to objects
	var xCoordObj = {value: usersRef.child(fromNumber).xCoord};
	var yCoordObj = {value: usersRef.child(fromNumber).yCoord};
	var redbullObj = {value: usersRef.child(fromNumber).redbull};
	var swagObj = {value: usersRef.child(fromNumber).swag};
	var perCompleteObj = {value: usersRef.child(fromNumber).perComplete};
	var gameOnObj = {value: usersRef.child(fromNumber).gameOn};
	var sentTextObj = {value: sentText};
	var replyObj = {value: ""};

	resp.message(replyObj.value);
	res.writeHead(200, {
		'Content-Type':'text/xml'
	});
	res.end(resp.toString());
});

var server = app.listen(4567, function() {
	console.log('Listening on port %d', server.address().port);
});
