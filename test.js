function runGame(xCoord, yCoord, redbull, swag, percComplete, gameOn, userText, reply) {
	reply = "@Player: ";

	//Step 1: Interpret userText and manipulate values accordingly
	//================================================================
	if(userText.value == "Let's play a game!") { //Inital testcase
		xCoord.value = 2;
		yCoord.value = 1;
		redbull.value = 5;
		swag.value = 0;
		percComplete.value = 0;
		gameOn.value = true;

		reply.value = reply.value + "You are a lowly n00b that just entered one of the greatest hackathons in the world! You need to make your way to the top collecting swag and redbull along the way. But first, you need to make it through registration. A lady wearing a purple T-shirt greets you, 'Hi there! Did you register for the event?' Your palms begin to sweat. You remember that you were too busy watching 'say yes to the dress' to actually sign-up.\n";
	}
	else if(gameOn.value == false) { //Error catching
		return; 
	}
	else if(xCoord.value == 1 && yCoord.value == 9 && percComplete.value >= 100 && userText.value == 3) {
		reply.value = reply.value + "Congrats! You have won UofThacks!!";
		gameOn.value = false;

	}
	else if(userText.value == 1 && isRegistrationSpace(xCoord.value, yCoord.value)) {
		reply.value = reply.value.ok + "That's fine! Here at U of T hacks, we love to see new hackers as passionate as you! Here are 5 more redbulls and your free T-shirt (+5 redbull, +1 swag). Be careful! Redbull is like a hacker's lifeforce. If you run out, you will sleep and then u'll never win UofThacks! Now go out and hack!\n";
		
		xCoord.value = xCoord.value + 1;
		redbull.value = redbull.value + 5;
		swag.value = swag.value + 1;
	}
	else if(userText.value == 2 && isRegistrationSpace(xCoord.value, yCoord.value)) {
		reply.value = reply.value + "Sorry, we don't accept peasents like you!\n";
	}
	else if(userText.value == 1) { //If the user moved north
		redbull.value = redbull.value - 1;
		if(checkObstical(xCoord.value, yCoord.value+1)) {
			reply.value = reply.value + "Your path is blocked by computer wires.\n";
		}
		else {
			reply.value = reply.value + "Move succesful!\n";
		}
	}
	else if(userText.value == 2) { //If the user moved west
		redbull.value = redbull.value - 1;
		if(checkObstical(xCoord.value+1, yCoord.value)) {
			reply.value = reply.value + "Your path is blocked by computer wires.\n";
		}
		else {
			reply.value = reply.value + "Move succesful!\n";
		}
	}
	else if(userText.value == 3) { //If the user moved east
	
		redbull.value = redbull.value - 1;
		if(checkObstical(xCoord.value-1, yCoord.value)) {
			reply.value = reply.value + "Your path is blocked by computer wires.\n";
		}
		else {
			reply.value = reply.value + "Move succesful!\n";
		}
	}
	else if(userText.value == 4) { //If the user moved south
		redbull.value = redbull.value - 1;
		if(checkObstical(xCoord.value, yCoord.value+1)) {
			reply.value = reply.value + "Your path is blocked by computer wires.\n";
		}
		else {
			reply.value = reply.value + "Move succesful!\n";
		}
	}
	else if(userText.value == 5 && isSponsorSpace(xCoord.value, yCoord.value)) { //If a user wants to talk to a sponsor
		reply.value = reply.value + "Hi, i'm sponsoring UofThacks. Here's some Redbull and swag (+3 Redbull, +2 swag)!";
		redbull.value = redbull.value + 3;
		swag.value = swag.value + 2;
	}
	else if(userText.value == 6 && isHackerSpace(xCoord.value, yCoord.value)) { //If a user wants to hack in a hackerspace
		reply.value = reply.value + "Hi, this is a hacker space! This is where you complete your project.";
		percComplete.value = percComplete.value + (5 * swag.value + 5);
	}
	else if(userText.value == 7 && isFoodSpace(xCoord.value, yCoord.value)) {
		reply.value = reply.value + "Hi, this is a food space. You get redbull here!";
		redbull.value = redbull.value + 6;
	}
	else if(redbull.value <= 0) {
		reply.value = reply.value + "You ran out of Redbull! GAME OVER!";
		gameOn.value = false;
	}


	//Step 2 - Display counters
	//=================================
	reply.value = reply.value + "Redbull: " + redbull.value +
		"\nSwag: " + swag.value + "\nPercent Complete: " + percComplete.value 
		+ "\n===============\n";

	//Step 3 - Ask user for action
	//===============================
	if(userText.value == "Let's play a game!") {
		reply.value = reply.value + "Do you:\n1.) Be honest\n2.) Lie\n(text back the number you choose!)";
	}
	else if(userText.value == 1 && isRegistrationSpace(xCoord.value, yCoord.value)) {
		reply.value = reply.value + "Do you:\n1.) Go north\n2.) Go west\n3.) Go east\n4.) Go south\n";
	}
	else if(userText.value == 2 && isRegistrationSpace(xCoord.value, yCoord.value)) {
		reply.value = reply.value + "GAME OVER!\nRemember to text us again to restart!";
		gameOn.value = false;
	}
	else if(isSponsorSpace(xCoord.value, yCoord.value)) {
		reply.value = reply.value + "You approach a sponsorship table and see a smiling man showing off his api. Do you:\n1.) Go north\n2.) Go west\n3.) Go east\n4.) Go south\n5.) Flirt with the sponsor";
	}
	else if(isHackerSpace(xCoord.value, yCoord.value)) {
		reply.value = reply.value + "You enter a classroom to a spew of garbage and creatures who smelled after not taking a shower in the last 7 hours. You decide this is a great place to hack. \nDo you:\n1.) Go north\n2.) Go west\n3.) Go east \n4.) Go south\n6.) Work on your hack";
	}
	else if(isFoodSpace(xCoord.value, yCoord.value)) {
		reply.value = reply.value + "You stumble down some stairs to see some redbull girls giving away free redbull.\nDo you:\n1.) Go north\n2.) Go west\n3.) Go east\n4.) Go south\n5.) Ask for redbull.";
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
