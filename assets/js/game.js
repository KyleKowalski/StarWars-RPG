$(document).ready(function() {

	// obvious variable is obvious - used for 'teaching' myself and others.
	var debugging = false;

	var player = {
		Choice:"",
		Opponent:"",
		YodaUnlocked:false,
		DarthVaderUnlocked:false,
		GrandMasterYodaUnlocked:false
	}

	var gameCharacters = initialSetup();

	$(document).on('click', function(event) {

		if (event.target.id != null && event.target.id != "") {
			// make sure we're only allowing id's that are valid for game use (ie dropping the 'title' div and what not)
			if (isValidClick(event.target.id)) {
				if (debugging) {console.log("User selection: " + event.target.id);}
	    		// initial player selection
	    		if (player.Choice == "") {
	    			player.Choice = event.target.id;
	    			if (debugging) {console.log("Selecting player: " + player.Choice);}
		    		gameCharacters[player.Choice].Status = "player";
		    		$("#initialSelection").addClass("hidden");
		    		characterDivSetup();
		    		$("#combatContainer").removeClass("hidden");
	    		}
	    		// assigning opponent selection
	    		else if (player.Opponent == "") {
	    			player.Opponent = event.target.id;
	    			if (debugging) {console.log("Selecting opponent: " + player.Opponent);}
	    			gameCharacters[player.Opponent].Status = "opponent";
	    			$("#selectOpponent").addClass("hidden");
	    			characterDivSetup();
	    		}
	    		else if (player.Choice != "" && player.Opponent != "") {
	    			if (debugging) {console.log("Received click for: " + event.target.id + " but combat is not yet resolved.  Ignoring the click." );}
	    		}
	    		else {
	    			if (debugging) {console.log("We have a problem with the on click events");}
	    		}

			}
			else if (event.target.id == "rules") {
				if (debugging) {console.log("hiding rules div");}
				$(".rules").addClass("hidden");
			}
			else if (event.target.id == "attackButton" && player.Opponent != "") {
				chooseOpponentAndFight(player.Opponent);
			}
			else if (event.target.id == "winLossContainer") {
				if (debugging) {console.log("game reset time!");}
			 	gameCharacters = initialSetup();
			}
			else {
				if (debugging) {console.log("we're clicking something we're not responding to at this time - clicked: " + event.target.id)}
			}
		}
	});

// Initial pseudo code
	// click button to choose my player
		// Luke
		// Obi-Wan
		// Darth Sideous
		// Darth Maul
		// TODO Add in:  Darth Vader / General Grievous / Yoda / Han + Chewie
		// TODO - make it choose 4x of these?  Or any/all?  Unlock toons?

	// other players become opponents - all three

	// when opponent HP drops to zero - opponent is defeated

	// player chooses next opponent (of remaining 2)

	// when oppoent HP drops to zero - oppoentn is defeated

	// player automagically fights last opponent

	// if player defeats everyone - player wins!

	// if players HP drops below 0... player loses

	// no health potions.  
// End initial pseudo code
	function chooseOpponentAndFight(Opponent) {
		if (debugging) {console.log("----- Battle Started -----");}
  		// player chooses one opponent
  		player.Opponent = Opponent;
  		gameCharacters[player.Opponent].Status = "opponent";
  		if (debugging) {console.log("Player using: " + player.Choice);}
  		if (debugging) {console.log("Currently facing off against: " + player.Opponent);}
  		if (debugging) {console.log("Current HP: " + gameCharacters[player.Choice].HP);}
  		if (debugging) {console.log("Current AP Growth: " + gameCharacters[player.Choice].APGrowth);}
  		if (debugging) {console.log("Player Current AP: " + gameCharacters[player.Choice].AP);}
  		if (debugging) {console.log("Opponent HP: " + gameCharacters[player.Opponent].HP);}
  		if (debugging) {console.log("Opponent Counter AP: " + gameCharacters[player.Opponent].CounterAP);}
		
		// click 'attack' - this attacks the target and increases base attack based on attack (attack = attack + basePower... goes up forever)
		// this also removes HP based on targets counterattack power
		
		// TODO write this to a text box for dramatic effect?
		if ((gameCharacters[player.Opponent].HP > 0) && (gameCharacters[player.Choice].HP > 0)) {
			// player attacks
			gameCharacters[player.Opponent].HP -= gameCharacters[player.Choice].AP;
			if (debugging) {console.log("Player damages opponent - their HP remaining: " + gameCharacters[player.Opponent].HP);}

			// player attack grows!
			gameCharacters[player.Choice].AP += gameCharacters[player.Choice].APGrowth;
			if (debugging) {console.log("Player learns to attack better! New AP: " + gameCharacters[player.Choice].AP);}

			// not damaged by counter if opponent defeated - we'll call this a house rule.  It makes the game SIGNIFICANTLY easier.  
			if (gameCharacters[player.Opponent].HP > 0) {
				// opponent counters
				gameCharacters[player.Choice].HP -= gameCharacters[player.Opponent].CounterAP;
				if (debugging) {console.log("Opponent counters, new HP: " + gameCharacters[player.Choice].HP);}
			}
		}

		if (gameCharacters[player.Opponent].HP <= 0) {
			if (debugging) {console.log("Opponent " + player.Opponent + " defeated!");}
			gameCharacters[player.Opponent].Status = "defeated";
			player.Opponent = "";
			$("#selectOpponent").removeClass("hidden");
			if(!(checkForWin())) {
				if (debugging) {console.log("Apparently no one is left to fight you.  You Win!");}
				$("#winLossContainer").css("background-image", "url(assets/images/gameWon.jpg)");
				$("#winLossContainer").removeClass("hidden");
				$(".winOrLossColor").css("color","black")
				$("#winOrLoss").html("You win!");
				if (player.YodaUnlocked == false) {
					console.log("A new player has joined: Yoda!");
					player.YodaUnlocked = true;
				}
				else if (player.YodaUnlocked == true) {
					if (player.DarthVaderUnlocked == false) {
						console.log("A new player has joined:  Darth Vader!");
						player.DarthVaderUnlocked = true;
					}
					else if (player.DarthVaderUnlocked == true) {
						if (player.GrandMasterYodaUnlocked == false) {
							console.log("A new player has joined:  GrandMaster Yoda!");
							player.GrandMasterYodaUnlocked = true;
						}
						else {
							console.log("this is Grandmaster Yoda's we can't get here");
						}
					}
					else {
						console.log("this is Darth Vaders we can't get here");
					}
				}
				else {
					console.log("this is Yoda's we can't get here");
				}
			};
		}
		else if (gameCharacters[player.Choice].HP <= 0) {
			if (debugging) {console.log("Player is defeated!");}
			$("#winLossContainer").css("background-image", "url(assets/images/gameLoss.jpg)");
			$("#winLossContainer").removeClass("hidden");
			$(".winOrLossColor").css("color","white")
			$("#winOrLoss").html("You lost!");
		}
		else {
			if (debugging) {console.log("Looks like both Opponent and player are alive.  Player HP: " + gameCharacters[player.Choice].HP + " Opponent HP: " + gameCharacters[player.Opponent].HP);}
		}
		if (debugging) {console.log("----- Battle Ended -----");}
		characterDivSetup();
	};

  	function characterDivSetup() {
  		// cleanup and splat things in again - is this the most efficient way?  Seems to work pretty well?  
  		// I'm trying to do this with few divs on the main page / just a skeleton
  		// cleanup for current round.  
  		$("#aliveCharactersHere").empty();
  		$("#playerCharacterHere").empty();
  		$("#opponentCharacterHere").empty();
  		$("#defeatedCharactersHere").empty();
  		var targetAliveDiv = $("#aliveCharactersHere");
  		var targetPlayerDiv = $("#playerCharacterHere");
  		var targetOpponentDiv = $("#opponentCharacterHere");
  		var targetDefeatedDiv = $("#defeatedCharactersHere");
		// get each character and give them a div
  		$.each(gameCharacters, function(name, character){

			var newDiv = document.createElement("div");
			var img = document.createElement("IMG");
			var statDiv = document.createElement("div");
			var aliveCount = 0;
			var defeatedCount = 0;

  			if (character.Status == "player"){
  				if (debugging) {console.log("This is the chosen player: " + character.FullName);}
  				targetPlayerDiv.append(newDiv);
  				newDiv.setAttribute("style", "background-color: green");
  				img.src = character.Image;
  			}
  			else if (character.Status == "opponent") {
  				if (debugging) {console.log("This is the chosen opponent: " + player.Opponent);}
  				targetOpponentDiv.append(newDiv);
  				newDiv.setAttribute("style", "background-color: red");
  				img.src = character.Image;
  			}
  			else if (character.Status == "alive") {
  				if (debugging) {console.log("This toon alive and ready in character pool: " + character.FullName);}
    			targetAliveDiv.append(newDiv);
    			newDiv.className = "col-xs-12 col-sm-6 col-md-6 col-lg-6 height100";
    			newDiv.setAttribute("style", "background-color: blue");
    			img.src = character.Image;
    		}
    		else if (character.Status == "defeated") {
  				if (debugging) {console.log("This toon alive and ready in character pool: " + character.FullName);}
    			targetDefeatedDiv.append(newDiv);
    			newDiv.className = "col-xs-12 col-sm-6 col-md-6 col-lg-6 height100";
    			newDiv.setAttribute("style", "background-color: red");
    			img.src = "assets/images/defeated.jpg";
    		}
    		else {
    			console.log("annnd we're broken again - something wrong with character divs");
    		}
			img.setAttribute("id", character.ShortName);
    		img.className = "relative"
    		statDiv.className = ".absoluteForImage";
    		statDiv.innerHTML = "<br>" + character.FullName + "<br>HP: " + character.HP + " AP: " + character.AP + " Counter: " + character.CounterAP;
    		newDiv.append(img)
    		newDiv.append(statDiv);

  		})
  	}

  	function initialSetup() {
		var gameCharacters = {
  			Luke: {
  				FullName:"Luke Skywalker",
  				ShortName:"Luke",
  				Status:"alive",
  				HP:100,
  				AP:20,
  				APGrowth:20,
  				CounterAP:7,
  				Image:"assets/images/Luke.jpg"},
  			ObiWan: {
  				FullName:"Obi-Wan Kenobi",
  				ShortName:"ObiWan",
  				Status:"alive",
  				HP:120,
  				AP:12,
  				APGrowth:12,
  				CounterAP:18,
  				Image:"assets/images/ObiWan.jpg"},
  			DarthSidious: {
  				FullName:"Darth Sidious",
  				ShortName:"DarthSidious",
  				Status:"alive",
  				HP:150,
  				AP:10,
  				APGrowth:10,
  				CounterAP:20,
				Image:"assets/images/DarthSidious.jpg"},
  			DarthMaul: {
  				FullName:"Darth Maul",
  				ShortName:"DarthMaul",
  				Status:"alive",
  				HP:180,
  				AP:5,
  				APGrowth:5,
  				CounterAP:35,
  				Image:"assets/images/DarthMaul.jpg"},
  			Yoda: {
  				FullName:"Yoda The Wise",
  				ShortName:"Yoda",
  				Status:"hidden",
  				HP:250,
  				AP:7,
  				APGrowth:7,
  				CounterAP:45,
  				Image:"assets/images/Yoda.jpg"},
  			DarthVader: {
  				FullName:"Darth Vader",
  				ShortName:"DarthVader",
  				Status:"hidden",
  				HP:200,
  				AP:15,
  				APGrowth:15,
  				CounterAP:35,
  				Image:"assets/images/DarthVader.jpg"},
  			GrandMasterYoda: {
  				FullName:"Grand Master Yoda",
  				ShortName:"GrandMasterYoda",
  				Status:"hidden",
  				HP:300,
  				AP:50,
  				APGrowth:50,
  				CounterAP:90,
  				Image:"assets/images/GrandMasterYoda.jpg"}
  		// 	Template: {
  		// 		FullName:"Template for later",
  		// 		ShortName:"Template",
  		// 		Status:"alive",
  		// 		HP:180,
  		// 		AP:10,
  		// 		APGrowth:10,
  		// 		CounterAP:25,
		// 		Image:"assets/images/Template.jpg"}
			}

			console.log("unlocked: Yoda/DarthVader/GMYoda: " + player.YodaUnlocked + "/" +player.DarthVaderUnlocked + "/" + player.GrandMasterYodaUnlocked);

			if (player.YodaUnlocked) {gameCharacters.Yoda.Status = "alive"}
			if (player.DarthVaderUnlocked) {gameCharacters.DarthVader.Status = "alive"}
			if (player.GrandMasterYodaUnlocked) {gameCharacters.GrandMasterYoda.Status = "alive"}

			$("#combatContainer").addClass("hidden");
			$("#winLossContainer").addClass("hidden");
			$("#initialSelection").removeClass("hidden");
			player.Choice = "";
			player.Opponent = "";

			targetDiv = $("#allCharactersHere");

			targetDiv.empty();

  		$.each(gameCharacters, function(name, character){

  			if (debugging) {console.log("name: " + name + " character: " + character);}
			var newDiv = document.createElement("div");
			var img = document.createElement("IMG");
			var statDiv = document.createElement("div");

			if (character.Status == "alive") {
  				if (debugging) {console.log("This toon alive and ready in character pool: " + character.FullName);}
    			targetDiv.append(newDiv);
    		}
    		else {
    			if (debugging) {console.log("annnd we're broken again - something wrong with initial setup: >" + character.FullName + "< >" + character.Status + "<");}
    		}
    		if (debugging) {console.log("Creating and appending div and image for: " + character.FullName);}
    		img.setAttribute("id", character.ShortName);
    		img.src = character.Image;
    		newDiv.append(img);
    		newDiv.append(statDiv);
    		newDiv.className = "col-xs-6 col-sm-6 col-md-3 col-lg-3 height100";
    		img.className = "relative"
    		statDiv.className = ".absoluteForImage";
    		statDiv.innerHTML = "<br>" + character.FullName + "<br>HP: " + character.HP;
  		})
  		return gameCharacters;
  	}

  	function characterStatusUpdate(thisCharacterDiv) {
  		targetDiv = $(thisCharacterDiv);
  		var newDiv = document.createElement("div");

		newDiv.innerHTML = character.HP;
    	newDiv.setAttribute("id", character.ShortName);
    	img.setAttribute("id", character.ShortName);
		img.src = character.Image;
		newDiv.append(img)
  	}

	function isValidClick(thisId) {
		var thisClickValidityCheck = false;
		$.each(gameCharacters, function(name, character){
			if (character.ShortName == thisId && character.Status == "alive") {
				if (debugging) {console.log("we have a valid click on a valid target");}
				thisClickValidityCheck = true;
			}
		});
		return thisClickValidityCheck;
	}

	function checkForWin() {
		if (debugging) {console.log("checking to see if we won as we just defeated another opponent");}
		var isAnyoneAliveStill = false;
		$.each(gameCharacters, function(name, character){
			if (character.Status == "alive") {
				if (debugging) {console.log("looks like we have a live one!  Keep playing!");}
				isAnyoneAliveStill = true;
			}
		});
		return isAnyoneAliveStill;
	}
});