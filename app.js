var twilio = require('twilio'),
client = twilio('***REMOVED***','***REMOVED***'),
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
	//console.log(snapshot.val());
})

app.post('/message', function(req, res) {
	var resp = new twilio.TwimlResponse();
	var fromNumber = req.body.From;
	var sentText = req.body.Body;
	var aString = "";

	usersRef.child(fromNumber).on("value", function(snapshot) {
		if(snapshot.val()===null) {return; }
	console.log(snapshot.val().xCoord);
	xCoordObj = {value: snapshot.val().xCoord};
	yCoordObj = {value: snapshot.val().yCoord};
	redbullObj = {value: snapshot.val().redbull};
	swagObj = {value: snapshot.val().swag};
	perCompleteObj = {value: snapshot.val().perComplete};
	gameOnObj = {value: snapshot.val().gameOn};
	longAssStringObj = {value: snapshot.val().longAssString};
	sentTextObj = {value: sentText};

	if(gameOnObj.value == false)
	{
		usersRef.child(fromNumber).remove();
	}

	}, function (errorObject){
	console.log("The read failed: " + errorObject.code);
	});

	if(req.body.Body == "Let's play a game!")
	{
		usersRef.child(req.body.From).set({
			xCoord: -1,
			yCoord: -1,
			perComplete: -1,
			redbull: -1,
			swag: -1,
			longAssString: "",
			gameOn: true
		})
	}
	else if(req.body.Body != "Let's play a game!")
	{
		aString = "To play, text this number \"Let's play a game!\"\n";
	}

	replyObj = {value: ""};
	runGame(xCoordObj,yCoordObj,redbullObj,swagObj,perCompleteObj,gameOnObj,sentTextObj,replyObj,longAssStringObj);

	usersRef.child(req.body.From).update({

		xCoord: xCoordObj.value,
		yCoord: yCoordObj.value,
		perComplete: perCompleteObj.value,
		redbull: redbullObj.value,
		swag: swagObj.value,
		gameOn: gameOnObj.value,
		longAssString: longAssStringObj.value
	});

	resp.message(replyObj.value + aString);
	res.writeHead(200, {
		'Content-Type':'text/xml'
	});
	res.end(resp.toString());
});

var server = app.listen(4567, function() {
	console.log('Listening on port %d', server.address().port);
});

/*
runGame is a testFunction that max made that does.... some stuff
It receives a fuckton of objects as parameters and (hopefully) can manipulate them and
their respective values. Values of objects are accesible via "[objectName].value" where
"[objectName]" should be replaced by the name of the actual object to be modified.
Since objects are passed by reference rather than by value, ANY CHANGES MADE TO THESE
OBJECTS CHANGE THE ORIGINAL OBJECTS THAT WERE PASSED. Great coding practice, obviously.
*/
function runGame(xCoord, yCoord, redbull, swag, percComplete, gameOn, userText, reply, mirandaIsCute) {
	reply.value = "@Player: ";

	//Step 1: Interpret userText and manipulate values accordingly
	//================================================================
	if(userText.value == "Let's play a game!") { //Inital testcase
		xCoord.value = 2;
		yCoord.value = 1;
		redbull.value = 5;
		swag.value = 0;
		percComplete.value = 0;
		gameOn.value = true;

		reply.value = reply.value + "Thou art a lowly n00b that just entered one of the greatest hackathons in the world! You need to make your way to the top collecting swag and Red Bull along the way. But first, you must make it through registration. A lady wearing a purple T-shirt greets you. 'Hi there! Did you register for UofTHacks?' Your palms begin to sweat. You remember that you were too busy watching 'Say Yes to the Dress' to actually sign-up.\n";
	}
	else if(gameOn.value == false) { //Error catching
		return; 
	}
	else if(xCoord.value == 1 && yCoord.value == 9 && percComplete.value >= 100 && userText.value == 3) {
		reply.value = reply.value + "CONGRATS! YOU HAVE WON UOFTHACKS!!";
		gameOn.value = false;
		return;

	}
	else if(userText.value == 1 && isRegistrationSpace(xCoord.value, yCoord.value)) {
		reply.value = reply.value + "That's fine! Here at UofTHacks, we love to see new hackers as passionate as you! Here are 5 more Red Bulls and your free T-shirt (+5 Red Bull, +1 swag). Be careful! Red Bull is like a hacker's lifeforce. If you run out, you will fall asleep - then you'll never be able to win UofThacks! Now get out there and hack!\n";
		xCoord.value = xCoord.value + 1;
		redbull.value = redbull.value + 5;
		swag.value = swag.value + 1;
	}
	else if(userText.value == 2 && isRegistrationSpace(xCoord.value, yCoord.value)) {
		reply.value = reply.value + "Sorry, we don't accept peasants like you!\n";
	}
	else if(userText.value == 1) { //If the user moved north
		redbull.value = redbull.value - 1;
		if(checkObstical(xCoord.value, yCoord.value+1)) {
			redbull.value = redbull.value - 2;
			reply.value = reply.value + "Your path is blocked by computer wires. You did not move.\n";
		}
		else {
			reply.value = reply.value + "Move succesful!\n";
			yCoord.value = yCoord.value + 1;
		}
	}
	else if(userText.value == 2) { //If the user moved west
		redbull.value = redbull.value - 1;
		if(checkObstical(xCoord.value+1, yCoord.value)) {
			redbull.value = redbull.value - 2;
			reply.value = reply.value + "Your path is blocked by computer wires. You did not move.\n";
		}
		else {
			reply.value = reply.value + "Move succesful!\n";
			xCoord.value = xCoord.value + 1;
		}
	}
	else if(userText.value == 3) { //If the user moved east
	
		redbull.value = redbull.value - 1;
		if(checkObstical(xCoord.value-1, yCoord.value)) {
			redbull.value = redbull.value - 2;
			reply.value = reply.value + "Your path is blocked by computer wires. You did not move.\n";
		}
		else {
			reply.value = reply.value + "Move succesful!\n";
			xCoord.value = xCoord.value - 1;
		}
	}
	else if(userText.value == 4) { //If the user moved south
		redbull.value = redbull.value - 1;
		if(checkObstical(xCoord.value, yCoord.value-1)) {
			redbull.value = redbull.value - 2;
			reply.value = reply.value + "Your path is blocked by computer wires. You did not move.\n";
		}
		else {
			reply.value = reply.value + "Move succesful!\n";
			yCoord.value = yCoord.value - 1;
		}
	}
	else if(userText.value == 5 && isSponsorSpace(xCoord.value, yCoord.value)  && shouldProc(xCoord.value, yCoord.value, mirandaIsCute.value)) { //If a user wants to talk to a sponsor
		if(addLetter(xCoord.value, yCoord.value) == "f") {
			reply.value = reply.value + "You approach a red colored table. There sat a man with a fluffy beard and cool glasses. He smiles and says, 'Hi I'm from twillo!' (+3 Red Bull, +2 swag)!\n";
		}
		else {
			reply.value = reply.value + "Hi, I'm sponsoring UofTHacks. Here's some Red Bull and swag (+3 Red Bull, +2 swag)!\n";
		}
		redbull.value = redbull.value + 3;
		swag.value = swag.value + 2;

		mirandaIsCute.value = mirandaIsCute.value + addLetter(xCoord.value, yCoord.value);
	}
	else if(userText.value == 6 && isHackerSpace(xCoord.value, yCoord.value)  && shouldProc(xCoord.value, yCoord.value, mirandaIsCute.value)) { //If a user wants to hack in a hackerspace
		reply.value = reply.value + "Hi, this is a hacker space! This is where you work on your project.\n";
		percComplete.value = percComplete.value + (5 * swag.value + 5);

		mirandaIsCute.value = mirandaIsCute.value + addLetter(xCoord.value, yCoord.value);
	}
	else if(userText.value == 7 && isFoodSpace(xCoord.value, yCoord.value) && shouldProc(xCoord.value, yCoord.value, mirandaIsCute.value)) {
		reply.value = reply.value + "Hi, this is a food space. You get Red Bull and cold pizza here!\n";
		redbull.value = redbull.value + 6;

		mirandaIsCute.value = mirandaIsCute.value + addLetter(xCoord.value, yCoord.value);
	}
	else if(redbull.value <= 0) {
		reply.value = reply.value + "You ran out of Red Bull! You find yourself slowly slipping into unconsciousness.\nGAME OVER!";
		gameOn.value = false;
		return;
	}


	//Step 2 - Display counters
	//=================================
	reply.value = reply.value + "Red Bull: " + redbull.value +
		"\nSwag: " + swag.value + "\nPercent Complete: " + percComplete.value 
		+ "\n===============\n";

	//Step 3 - Ask user for action
	//===============================
	if(userText.value == "Let's play a game!") {
		reply.value = reply.value + "Do you:\n1) Be honest\n2) Lie\n(text back the number you choose!)";
	}
	else if(userText.value == 1 && isRegistrationSpace(xCoord.value, yCoord.value)) {
		reply.value = reply.value + "Do you:\n1) Go north\n2) Go west\n3) Go east\n4) Go south\n";
	}
	else if(userText.value == 2 && isRegistrationSpace(xCoord.value, yCoord.value)) {
		reply.value = reply.value + "GAME OVER!\nRemember to text us again to restart!";
		gameOn.value = false;
	}
	else if(isSponsorSpace(xCoord.value, yCoord.value)) {
		reply.value = reply.value + "You approach a sponsorship table and see a smiling man showing off his API. Do you:\n1) Go north\n2) Go west\n3) Go east\n4) Go south";
		if(shouldProc(xCoord.value, yCoord.value, mirandaIsCute.value)) {
			reply.value = reply.value + "\n5) Flirt with the sponsor";
		}
	}
	else if(isHackerSpace(xCoord.value, yCoord.value)) {
		reply.value = reply.value + "You enter a classroom to a spew of garbage and creatures who smelled after not taking a shower in the last 7 hours. You decide this is a great place to hack. \nDo you:\n1) Go north\n2) Go west\n3) Go east \n4) Go south";
		if(shouldProc(xCoord.value, yCoord.value, mirandaIsCute.value)) {
			reply.value = reply.value + "\n6) Work on your hack";
		}
	}
	else if(isFoodSpace(xCoord.value, yCoord.value)) {
		reply.value = reply.value + "You stumble down some stairs to see some Red Bull distributors giving away free Red Bull.\nDo you:\n1) Go north\n2) Go west\n3) Go east\n4) Go south";
		if(shouldProc(xCoord.value, yCoord.value, mirandaIsCute.value)) {
			reply.value = reply.value + "\n7) Ask for Red Bull.";
		}
	}
	else if(isLobbySpace(xCoord.value, yCoord.value)) {
		reply.value = reply.value + "You are in a barren lobby. Do you:\n1) Go north\n2) Go west\n3) Go east\n4) Go south\n";
	}
}


/**
* REQUIRES: x > 0 and y > 0
* EFFECTS: Returns true when player coords are on a hackerspace
*/
function isHackerSpace (x, y) {
	return (x == 1 && y == 4) ||
		(x == 1 && y == 6) ||
		(x == 1 && y == 7) ||
		(x == 4 && y == 7) ||
		(x == 4 && y == 8) ||
		(x == 3 && y == 8);
}

/**
* REQUIRES: x > 0 and y > 0
* EFFECTS: Returns true when player coords are on a Lobby
*/
function isLobbySpace (x, y) {
	return (x == 1 && y == 1) ||
		(x == 3 && y == 1) ||
		(x == 2 && y == 2) ||
		(x == 3 && y == 2) ||
		(x == 4 && y == 2) ||
		(x == 1 && y == 3) ||
		(x == 4 && y == 2) ||
		(x == 1 && y == 3) ||
		(x == 3 && y == 3) ||
		(x == 1 && y == 5) ||
		(x == 3 && y == 5) ||
		(x == 2 && y == 6) ||
		(x == 1 && y == 9) ||
		(x == 2 && y == 9) ||
		(x == 3 && y == 9);
}

/**
* REQUIRES: x > 0 and y > 0
* EFFECTS: Returns true when player coords are on a Foodspace
*/
function isFoodSpace (x, y) {
	return (x == 4 && y == 1) ||
		(x == 4 && y == 3) ||
		(x == 2 && y == 5) ||
		(x == 3 && y == 6) ||
		(x == 3 && y == 7);
}

/**
* REQUIRES: x > 0 and y > 0
* EFFECTS: Returns true when player coords are on a Sponsorspace
*/
function isSponsorSpace (x, y) {
	return (x == 1 && y == 2) ||
		(x == 2 && y == 4) ||
		(x == 4 && y == 5) ||
		(x == 2 && y == 7) ||
		(x == 4 && y == 9);
}

/**
* REQUIRES: x > 0 and y > 0
* EFFECTS: Returns true when player coords are on a Registration space
*/
function isRegistrationSpace (x, y) {
	return (x == 2 && y == 1);
}

/**
* REQUIRES: PLAYER HAS NOT ALREADY MOVED
* EFFECTS: Returns true when player coords are on a Obsticalspace
*/
function checkObstical (x, y) {
	return (x == 2 && y == 3) ||
		(x == 3 && y == 4) ||
		(x == 4 && y == 4) ||
		(x == 4 && y == 6) ||
		(x == 1 && y == 8) ||
		(x == 2 && y == 8) ||
		(x == 2 && y == 1) ||
		x == 0 || x == 5 ||
		y == 0 || y == 10;
}

function addLetter(x, y) {
	if (x == 4 && y == 1) {
		return "a";
	}
	else if (x == 4 && y == 3) {
		return "b";
	}
	else if (x == 2 && y == 5) {
		return "c";
	}
	else if (x == 3 && y == 6) {
		return "d";
	}
	else if (x == 3 && y == 7) {
		return "e";
	}
	else if (x == 1 && y == 2) {
		return "f";
	}
	else if (x == 2 && y == 4) {
		return "g";
	}
	else if (x == 4 && y == 5) {
		return "h";
	}
	else if (x == 2 && y == 7) {
		return "i";
	}
	else if (x == 4 && y == 9) {
		return "j";
	}
	else if (x == 1 && y == 4) {
		return "k";
	}
	else if (x == 1 && y == 6) {
		return "l";
	}
	else if (x == 1 && y == 7) {
		return "m";
	}
	else if (x == 4 && y == 7) {
		return "n";
	}
	else if(x == 4 && y == 8) {
		return "o";
	}
	else if (x == 3 && y == 8) {
		return "p";
	}
	else {
		return "";
	}
}

//Returns true when the letter for x, y is not inside string mirandaIsCute
function shouldProc(x, y, mirandaIsCute) {
	if(x == 4 && y == 1 && mirandaIsCute.indexOf("a") == -1) {
		return true;
	}
	else if(x == 4 && y == 3 && mirandaIsCute.indexOf("b") == -1) {
		return true;
	}
	else if(x == 2 && y == 5 && mirandaIsCute.indexOf("c") == -1) {
		return true;
	}
	else if(x == 3 && y == 6 && mirandaIsCute.indexOf("d") == -1) {
		return true;
	}
	else if(x == 3 && y == 7 && mirandaIsCute.indexOf("e") == -1) {
		return true;
	}
	else if(x == 1 && y == 2 && mirandaIsCute.indexOf("f") == -1) {
		return true;
	}
	else if(x == 2 && y == 4 && mirandaIsCute.indexOf("g") == -1) {
		return true;
	}
	else if(x == 4 && y == 5 && mirandaIsCute.indexOf("h") == -1) {
		return true;
	}
	else if(x == 2 && y == 7 && mirandaIsCute.indexOf("i") == -1) {
		return true;
	}
	else if(x == 4 && y == 9 && mirandaIsCute.indexOf("j") == -1) {
		return true;
	}
	else if(x == 1 && y == 4 && mirandaIsCute.indexOf("k") == -1) {
		return true;
	}
	else if(x == 1 && y == 6 && mirandaIsCute.indexOf("l") == -1) {
		return true;
	}
	else if(x == 1 && y == 7 && mirandaIsCute.indexOf("m") == -1) {
		return true;
	}
	else if(x == 4 && y == 7 && mirandaIsCute.indexOf("n") == -1) {
		return true;
	}
	else if(x == 4 && y == 8 && mirandaIsCute.indexOf("o") == -1) {
		return true;
	}
	else if(x == 3 && y == 8 && mirandaIsCute.indexOf("p") == -1) {
		return true;
	}
	else {
		return false;
	}
}
