let intPos = [0, 2, 0, 0, 0, 0, -5, 0, -3, 0, 0, 0, 5, -5, 0, 0, 0, 3, 0, 5, 0, 0, 0, 0, -2, 0, 0 , 0];
let testPos = [0, 0, -3, -3, -3, -3, -3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 0, 0, 0 , 0];
var rooms = [];
var die1, die2;
var activeDie;
var doubleDice = false;
var player = 1;
var moveCounter = 0;
var maxMoves = 0;
var allBlueHome = false;
var allRedHome = false;
var positionStack = [];
var picOfElements = {};
var audio;
var diePics = ["", 'url(images/die1.png)', 'url(images/die2.png)', 'url(images/die3.png)', 'url(images/die4.png)', 'url(images/die5.png)', 'url(images/die6.png)'];



function initBoard() {
	
	//top left edge 
	$('<div class= "edge"></div>').appendTo('#gameBoard');
	//top left home edge
	for(i=13; i<19; i++){
		$('<div class= "edge"></div>')
		.html(i)
		.attr("id", 'ind' + i)
		.appendTo('#gameBoard');
	}
	//middle edge 
	$('<div class= "edge"></div>').appendTo('#gameBoard');
	//top right home edge
	for(i=19; i<25; i++){
		$('<div class= "edge"></div>')
		.html(i)
		.attr("id", 'ind' + i)
		.appendTo('#gameBoard');
	}
	//top right edge 
	$('<div class= "edge"></div>').attr("id", "topEdge").appendTo('#gameBoard');
	//break div to go bottom side of board
	$('<div class="break"></div>').appendTo('#gameBoard');
	//top left bar add to board
	$('<div class="bar"></div>').appendTo('#gameBoard');

	//rooms 13-18 add to board
	for(i=13; i<19; i++) {
		var backGroundClass = (i%2 == 0 ? 'topRed' : 'topBlue');
		//alert(i + backGroundClass)
		$('<div class="room"><div class="top"></div></div>')
		.data('num', i)
		.attr('id', 'room'+i)
		.appendTo('#gameBoard')
		.addClass(backGroundClass);
	}

	//top middle bar add to board
	$('<div id="topBar" class="bar"><div class="bottom"></div></div>')
	.data('num', 25)
	.appendTo('#gameBoard');

	//rooms 19-24 add to board
	for(i=19; i<25; i++) {
		var backGroundClass = (i%2 == 0 ? 'topRed' : 'topBlue');
		$('<div class="room"><div class="top"></div></div>')
		.data('num', i)
		.attr('id', 'room'+i)
		.appendTo('#gameBoard')
		.addClass(backGroundClass);
	}

	//top right bar add to board
	$('<div id="redHome" class="bar"><div class="top"></div></div>').appendTo('#gameBoard');

	//break div to go bottom side of board
	$('<div class="break"></div>').appendTo('#gameBoard');

	//add middle point of left bar
	$('<div class="midbar"></div>').appendTo('#gameBoard');
	//add left middle area
	$('<div id="leftArea" class="midroom"><div class="die1"></div><div class="die2"></div><div class="confirm"> Confirm </div><div class="undo"> Undo </div></div>').appendTo('#gameBoard');
	//add middle point of middle bar
	$('<div id="passDice" class="midbar"></div>').appendTo('#gameBoard');
	//add right middle area
	$('<div id="rightArea" class="midroom"><div class="die1"></div><div class="die2"></div><div class="confirm"> Confirm </div><div class="undo"> Undo </div></div>').appendTo('#gameBoard');
	//add middle point of right bar
	$('<div class="midbar"></div>').appendTo('#gameBoard');

	//break div to go bottom side of board
	$('<div class="break"></div>').appendTo('#gameBoard');

	//bottom left board add to board
	$('<div class="bar"></div>').appendTo('#gameBoard');

	//room 7-12 add board
	for(i=12; i>6; i--) {
		var backGroundClass = (i%2 == 0 ? 'botRed' : 'botBlue');
		$('<div class="room"><div class="bottom"></div></div>')
		.data('num', i)
		.attr('id', 'room'+i)
		.appendTo('#gameBoard')
		.addClass(backGroundClass);
	}

	//middle bar add to board
	$('<div id="bottomBar" class="bar"><div class="top"></div></div>')
	.data('num', 0)
	.appendTo('#gameBoard');

	//room 1-6 add to board
	for(i=6; i>0; i--) {
		var backGroundClass = (i%2 == 0 ? 'botRed' : 'botBlue');
		$('<div class="room"><div class="bottom"></div></div>')
		.data('num', i)
		.attr('id', 'room'+i)
		.appendTo('#gameBoard')
		.addClass(backGroundClass);
	}

	//bottom right bar add to board
	$('<div id="blueHome" class="bar"><div class="bottom"></div></div>').appendTo('#gameBoard');
	//break div to go bottom side of board
	$('<div class="break"></div>').appendTo('#gameBoard');
	//bottom left edge 
	$('<div class= "edge"></div>').appendTo('#gameBoard');
	//top left home edge
	for(i=12; i>6; i--){
		$('<div class= "edge"></div>')
		.html(i)
		.attr("id", 'ind' + i)
		.appendTo('#gameBoard');
	}
	//middle edge 
	$('<div class= "edge"></div>').appendTo('#gameBoard');
	//top right home edge
	for(i=6; i>0; i--){
		$('<div class= "edge"></div>')
		.html(i)
		.attr("id", 'ind' + i)
		.appendTo('#gameBoard');
	}
	//top right edge 
	$('<div class= "edge"></div>').attr("id", "botEdge").appendTo('#gameBoard');
	

	// make rooms dropable
	$(".room").droppable({ 
		accept: '.checker',
		hoverClass: 'hoverd',
		drop: droped
	});
	//make home bar dropable
	$("#blueHome, #redHome").droppable({ 
		accept: '.checker',
		hoverClass: 'hoverd',
		drop: dropedToHome
	});
}

function loadRoom(posArr, roomId){
	var roomValue = posArr[roomId];
	var roomName = '#room' + roomId ;
	var checker = (roomValue > 0 ? '<div class="checker red"></div>' : '<div class="checker blue"></div>');
	var checkerCount = (roomValue > 0 ? roomValue : -roomValue);
		$(roomName).children().html('');
		for (j=0; j < checkerCount; j++) {
				$(roomName).children().append(checker);
		}
	if(checkerCount > 6){
		compactCheckers(roomId);
	}	
}

function loadPos(posArr) {
	rooms = posArr;
	for(i=1; i<25; i++) {
		/* checkerCount = posArr[i];
		roomId = '#room' + i ;
		checker = (checkerCount > 0 ? '<div class="checker red"></div>' : '<div class="checker blue"></div>');
		count = (checkerCount > 0 ? checkerCount : -checkerCount);
		$(roomId).children().html('');
		for (j=0; j < count; j++) {
				$(roomId).children().append(checker);
		} */
		loadRoom(posArr, i);	
	}

	checkerCount = posArr[25];
	checker = (checkerCount > 0 ? '<div class="checker red"></div>' : '<div class="checker blue"></div>');
	count = (checkerCount > 0 ? checkerCount : -checkerCount);
	$('#topBar .bottom').html('');
	for (k=0; k < count; k++) {
		$('#topBar .bottom').append(checker);
	}	

	checkerCount = posArr[0];
	checker = (checkerCount > 0 ? '<div class="checker red"></div>' : '<div class="checker blue"></div>');
	count = (checkerCount > 0 ? checkerCount : -checkerCount);
	$('#bottomBar .top').html('');
	for (k=0; k < count; k++) {
		$('#bottomBar .top').append(checker);
	}	

	checkerCount = posArr[27];
	checker = (checkerCount > 0 ? '<div class="homedChecker red"></div>' : '<div class="homedChecker"></div>');
	count = (checkerCount > 0 ? checkerCount : -checkerCount);
	$('#blueHome .bottom').html('');
	for (k=0; k < count; k++) {
		$('#blueHome .bottom').append(checker);
	}

	checkerCount = posArr[26];
	checker = (checkerCount > 0 ? '<div class="homedChecker red"></div>' : '<div class="homedChecker"></div>');
	count = (checkerCount > 0 ? checkerCount : -checkerCount);
	$('#redHome .top').html('');
	for (k=0; k < count; k++) {
		$('#redHome .top').append(checker);
	}	
	

	//make checkers draggable
	$('.checker').draggable({
		revert: true ,
		stack: '.checker',
		helper: 'original'
	});

}