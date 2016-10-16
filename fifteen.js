$(document).ready(function(){
	$("div div div").addClass("puzzlepiece");

	//These will help position the divs properly in the puzzle area
    var posx = parseInt($("#puzzlearea").css("top"));
    var posy = parseInt($("#puzzlearea").css("left"));

    //These are for the pics position
    var picx = 0;
    var picy = 0;
    
    //Positions for blank square
    var blankx = 300;
    var blanky = 300;

	var pieces = document.getElementsByClassName("puzzlepiece");

	for(var i=0; i < pieces.length; i++){
		//positioning the image on each div
		$(pieces[i]).css("background-position", picx+"px "+picy+"px");

		picx -= 100;
		if(picx%400 == 0){ picy -= 100; }

		//Positioning each div
		$(pieces[i]).css("top", posy);
		$(pieces[i]).css("left", posx);

		posx += 100;

		if(i !=0 && (i+1)%4 == 0){ 
			posy += 100; 
			posx = parseInt($("#puzzlearea").css("top")); 
		}

		//Glow piece if hovered
		$(pieces[i]).on("mouseover", function(){
			if(validate(this)){ $(this).addClass("movablepiece"); }
		});

		//If mouse leaves don't remove movable class
		$(pieces[i]).on("mouseleave", function(){
			$(this).removeClass("movablepiece");
		});

		//Switch piece with blank if clicked
		$(pieces[i]).on("click", function(){
			if(validate(this)){ switchTile(this); }
		});
	}

	//Test if tiles are near blank tile
	var validate = function(piece){

		if(((parseInt($(piece).css("top")) - blanky == 100 || parseInt($(piece).css("top")) - blanky == -100) && parseInt($(piece).css("left")) - blankx == 0)
			||((parseInt($(piece).css("left")) - blankx == 100 || parseInt($(piece).css("left")) - blankx == -100) && parseInt($(piece).css("top")) - blanky == 0)){
				return true;
			}

		else{ return false; }
	};

	//function to switch
	var switchTile = function(move){
		var tempx = blankx;
		var tempy = blanky;

		blanky = parseInt($(move).css("top"));
		blankx = parseInt($(move).css("left"));

        $(move).css("top", tempy);
		$(move).css("left", tempx);
	};

    //check if next to blank then move
	var movepiece = function(){

		var arr = []; //holds tiles we want

		for(var i=0; i < pieces.length; i++){
			if (validate(pieces[i]) == true){
				arr.push(pieces[i]);
			}
		}

		//get random tile that is next to blank tile
		var move = arr[Math.floor(Math.random() * arr.length)];

		//switch the blank tile with the random tile
		switchTile(move);

	};

	$("#shufflebutton").on("click", function(){
		//amount of times to move piece while shuffling (between 100 and 200)
		times = Math.floor(Math.random() * 100) + 100;

		for(var i=0; i < times; i++){
			movepiece();
		}
	});
});