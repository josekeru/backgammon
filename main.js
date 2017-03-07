// javascript code comes here
var rooms = [0, 2, 0, 0, 0, 0, -5, 0, -3, 0, 0, 0, 5, -5, 0, 0, 0, 3, 0, 5, 0, 0, 0, 0, -2, 0];
var die1, die2;
var player = -1;
var moveCounter = 0;
$( init );

function init() {

	initBoard();
	loadPos(rooms);

	gameFlow();
}

function gameFlow() {
	throwDice();
}

function droped(event, ui) {
	var startRoom = ui.draggable.parent().parent().data('num');
	var dropRoom = $(this).data('num')
	if (moveIsAlowed(startRoom, dropRoom)) {
		var newElement = '<div class="' + ui.draggable.attr('class') + '"></div>';
		//alert($(this).data('num'));
		//alert(ui.draggable.parent().parent().data('num'));
		ui.draggable.remove();

		$(this).children().append(newElement);

		$('.checker').draggable({
			revert: true ,
			stack: '.checker',
			helper: 'original'
		}); 

		regMove(startRoom, dropRoom);
	}

}

function moveIsAlowed(started, droped) {
	// check if right players checker moved
	if (rooms[started] * player > 0) {
		// check if die one number moved
		if(started + die1 * player == droped) {
			// check if drop room blocked width opponent
			if(rooms[droped] * player > -2) {
				die1 = 100;
				$('#die1').css('opacity',0.5);
				return true;
			}
			
		}
		// check if die one number moved
		if(started + die2 * player == droped) {
			// check if drop room blocked width opponent
			if(rooms[droped] * player > -2) {
				die2 = 100;
				$('#die2').css('opacity',0.5);
				return true;
			}
		}
	}
	return false;
}

function regMove(started, droped) {
	rooms[started] = rooms[started] - player;
	rooms[droped] = rooms[droped] + player;
	moveCounter++;
	$('#undo').show();
	if(moveCounter == 2) {
		$('#confirm').show();
	}
	console.log(rooms);
}

function initBoard() {
	
	//top left bar add to board
	$('<div class="bar"></div>').appendTo('#gameBoard');

	//rooms 13-18 add to board
	for(i=13; i<19; i++) {
		$('<div class="room"><div class="top"></div></div>')
		.data('num', i)
		.attr('id', 'room'+i)
		.appendTo('#gameBoard');
	}

	//top middle bar add to board
	$('<div class="bar"></div>').appendTo('#gameBoard');

	//rooms 19-24 add to board
	for(i=19; i<25; i++) {
		$('<div class="room"><div class="top"></div></div>')
		.data('num', i)
		.attr('id', 'room'+i)
		.appendTo('#gameBoard');
	}

	//top right bar add to board
	$('<div class="bar"></div>').appendTo('#gameBoard');

	//break div to go bottom side of board
	$('<div class="break"></div>').appendTo('#gameBoard');

	//add middle point of left bar
	$('<div class="midbar"></div>').appendTo('#gameBoard');
	//add left middle area
	$('<div id="leftArea" class="midroom"></div>').appendTo('#gameBoard');
	//add middle point of middle bar
	$('<div class="midbar"></div>').appendTo('#gameBoard');
	//add right middle area
	$('<div id="rightArea" class="midroom"></div>').appendTo('#gameBoard');
	//add middle point of right bar
	$('<div class="midbar"></div>').appendTo('#gameBoard');

	//break div to go bottom side of board
	$('<div class="break"></div>').appendTo('#gameBoard');

	//bottom left board add to board
	$('<div class="bar"></div>').appendTo('#gameBoard');

	//room 7-12 add board
	for(i=12; i>6; i--) {
		$('<div class="room"><div class="bottom"></div></div>')
		.data('num', i)
		.attr('id', 'room'+i)
		.appendTo('#gameBoard');
	}

	//middle bar add to board
	$('<div class="bar"></div>').appendTo('#gameBoard');

	//room 1-6 add to board
	for(i=6; i>0; i--) {
		$('<div class="room"><div class="bottom"></div></div>')
		.data('num', i)
		.attr('id', 'room'+i)
		.appendTo('#gameBoard');
	}

	//bottom right bar add to board
	$('<div class="bar"></div>').appendTo('#gameBoard');


	// make rooms dropable
	$(".room").droppable({ 
		accept: '.checker',
		hoverClass: 'hoverd',
		drop: droped
	});
}

function loadPos(posArr) {
	for(i=1; i<25; i++) {
		checkerCount = posArr[i];
		roomId = '#room' + i ;
		checker = (checkerCount > 0 ? '<div class="checker red"></div>' : '<div class="checker blue"></div>');
		count = (checkerCount > 0 ? checkerCount : -checkerCount);
		
		for (j=0; j < count; j++) {
				$(roomId).children().append(checker);
		}	
	}

	//make checkers draggable
	$('.checker').draggable({
		revert: true ,
		stack: '.checker',
		helper: 'original'
	});

}

function throwDice() {
	die1 = Math.floor(Math.random() * 6 + 1);
	die2 = Math.floor(Math.random() * 6 + 1);

	var diceHtml = '<div id="die1" class="die">' + die1 + '</div>';
	diceHtml += '<div id= "die2" class="die">' + die2 + '</div>';
	diceHtml += '<div id="confirm"> Confirm </div>';
	diceHtml += '<div id="undo"> Undo </div>';

	if (player == -1) {
		$('#rightArea').html(diceHtml);
	} else {
		$('#leftArea').html(diceHtml);
	}
	

}