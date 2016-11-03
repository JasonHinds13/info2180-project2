
//Extra Done: Animation (Grade This)
//Extra Done: Game Time
//Extra Done: Slide Rows and Columns
//Extra Done: End of Game Notification

"use strict";

$(document).ready(function(){
	$("#puzzlearea div").addClass("puzzlepiece");

	//These will help position the divs properly in the puzzle area
    var posy = parseInt($("#puzzlearea").css("top"));
    var posx = parseInt($("#puzzlearea").css("left"));

    //These are for the pics position
    var picx = 0;
    var picy = 0;
    
    //Positions for blank square
    var blankx = 300;
    var blanky = 300;

    var sec = 0; //Time in seconds
    var moves = 0; //moves the player has made

    //highscores
    var best_sec = 0;
    var best_moves = 0;

    var interval = null; //time keeping

    var exp = document.querySelector(".explanation"); //uses the first as output field

    var originalpos = []; //holds original position position of pieces to win
    var currentpos = []; //holds the current position of pieces

    //win function
    var winner = function(){

    	clearInterval(interval);

    	function getBest(){
    		if(best_sec == 0 && best_moves == 0){
    			best_sec = sec;
    			best_moves = moves;
    		}
    		else{
    		    if(sec <= best_sec){ best_sec = sec; }
    		    if(moves <= best_moves){ best_moves = moves; }
    		}

    		return " BEST TIME: "+best_sec+" BEST MOVES: "+best_moves;
    	}

    	exp.innerHTML = "YOU WIN! Time: "+sec+" seconds "+"Moves: "+moves;
    	exp.innerHTML += getBest();

    	$(exp).css("color", "green");
    	$(exp).css("text-decoration", "underline");
    };

    //check if we win
    var checkWin = function(){

    	currentpos = [];

    	for(var i=0; i < pieces.length; i++){
    		currentpos.push($(pieces[i]).css("top"));
		    currentpos.push($(pieces[i]).css("left"));
    	}

    	if(originalpos.toString() == currentpos.toString()){
    		winner();
    	}
    };

    //timer function
	var timer = function(){
		interval = setInterval(function(){
			sec++;
			exp.innerHTML = "Time Taken: "+sec+" seconds "+"Moves Made: "+moves;
			checkWin();
		}, 1000);
	};

	var pieces = document.getElementsByClassName("puzzlepiece");

	for(var i=0; i < pieces.length; i++){
		//positioning the image on each div
		$(pieces[i]).css("background-position", picx+"px "+picy+"px");

		picx -= 100;
		if(picx%400 == 0){ picy -= 100; }

		//Positioning each div
		$(pieces[i]).css("top", posy);
		$(pieces[i]).css("left", posx);

		originalpos.push($(pieces[i]).css("top"));
		originalpos.push($(pieces[i]).css("left"));

		posx += 100;

		if(i !=0 && (i+1)%4 == 0){ 
			posy += 100; 
			posx = parseInt($("#puzzlearea").css("left"));
		}

		//Glow piece if hovered
		$(pieces[i]).on("mouseover", function(){
			if(validate(this) || multiMV(this)){ $(this).addClass("movablepiece"); }
		});

		//If mouse leaves don't remove movable class
		$(pieces[i]).on("mouseleave", function(){
			$(this).removeClass("movablepiece");
		});

		//Switch piece with blank if clicked
		$(pieces[i]).on("click", function(){
			if(validate(this)){
				switchTile(this, true);
				moves++;
			}
			else if(multiMV(this)){ 
				moveMultiple(this); 
				moves++;
			}
		});
	}

	//Test if row/column can be moved
	var multiMV = function(piece){
		if(parseInt($(piece).css("top")) == blanky || parseInt($(piece).css("left")) == blankx){
			return true;
		}
		else{ return false; }
	};

	//Move multiple tiles in the same row or column
	var moveMultiple = function(piece){

		function helpFind(x, pos, cond){
			var all = [];

			for(var i=0; i < pieces.length; i++){
				var dis = Math.abs(parseInt($(pieces[i]).css("left")) - blankx);
				var dis2 = Math.abs(parseInt($(pieces[i]).css("top")) - blanky);

				var diff = Math.abs(parseInt($(pieces[i]).css("left")) - parseInt($(piece).css("left")));
				var dif2 = Math.abs(parseInt($(pieces[i]).css("top")) - parseInt($(piece).css("top")));

				if (pos === "row" && parseInt($(pieces[i]).css("top")) == x && dis <= cond && diff <= 200){
					all.push(pieces[i]);
				}
				else if (pos === "col" && parseInt($(pieces[i]).css("left")) == x && dis2 <= cond && dif2 <= 200){
					all.push(pieces[i]);
				}
			}

			return all;
		}

		if(parseInt($(piece).css("top")) == blanky){
			//move row
			var x = parseInt($(piece).css("top"));

			var dis = Math.abs(parseInt($(piece).css("left")) - blankx);

			var allrow = helpFind(x, "row", dis);
			var len = allrow.length;

			for(var c=0; c < len; c++){
			    for(var i=0; i < len; i++){
				    if(validate(allrow[i])){
				        switchTile(allrow[i], true); 
				        allrow.splice(i, 1);
				    }
			    }
		    }
		}

		else if(parseInt($(piece).css("left")) == blankx){
			//move column
			var x = parseInt($(piece).css("left"));

			var dis = Math.abs(parseInt($(piece).css("top")) - blanky);

			var allrow = helpFind(x, "col", dis);
			var len = allrow.length;

			for(var c=0; c < len; c++){
			    for(var i=0; i < len; i++){
				    if(validate(allrow[i])){
				        switchTile(allrow[i], true); 
				        allrow.splice(i, 1);
				    }
			    }
		    }
		}
	};

	//Test if tiles are near blank tile
	var validate = function(piece){

		if(((parseInt($(piece).css("top")) - blanky == 100 || parseInt($(piece).css("top")) - blanky == -100) && parseInt($(piece).css("left")) - blankx == 0) ||
			((parseInt($(piece).css("left")) - blankx == 100 || parseInt($(piece).css("left")) - blankx == -100) && parseInt($(piece).css("top")) - blanky == 0)){
				return true;
			}

		else{ return false; }
	};

	//function to switch (move: tile to move, anim: whether to animate or not)
	var switchTile = function(move, anim){
		var tempx = blankx;
		var tempy = blanky;

		blanky = parseInt($(move).css("top"));
		blankx = parseInt($(move).css("left"));

		if(anim){
			$(move).animate({'top': tempy, 'left': tempx}, 'slow');
		}
		else{
            $(move).css("top", tempy);
		    $(move).css("left", tempx);
	    }
	};

    //check if next to blank then move
	var movepiece = function(){

		var arr = []; //holds tiles we want

		for(var i=0; i < pieces.length; i++){
			if (validate(pieces[i])){
				arr.push(pieces[i]);
			}
		}

		//get random tile that is next to blank tile
		var move = arr[Math.floor(Math.random() * arr.length)];

		//switch the blank tile with the random tile
		switchTile(move, false);
	};

	$("#shufflebutton").on("click", function(){

		//Back to normal (re-initialize)
		sec = 0;
        moves = 0;
        $(exp).css("color", "black");
        $(exp).css("text-decoration", "none");

		//amount of times to move piece while shuffling (between 100 and 200)
		var times = Math.floor(Math.random() * 100) + 100;

		for(var i=0; i < times; i++){
			movepiece();
		}

		clearInterval(interval);
		timer();
	});
});