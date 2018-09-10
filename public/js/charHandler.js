var currentKey;          //records the current key pressed
var TimerWalk;    
var charStep = 2;       //1=1st foot, 2=stand, 3=2nd foot, 4=stand
var charSpeed = 50; //how fast the character will move
var gap=15;
var rightOk=true;

$(document).ready(function(){
console.log("length of character is " + $("#character").length);
console.log("LEFT  of character is " + $("#character").css("left"));

});

//if there is no currentKey down, execute charWalk
$(document).keydown(function(e) {
    if (!currentKey) {   
      //set the currentKey to the key that is down
      currentKey = e.keyCode;
	  //console.log("the current key is "+ currentKey);
			  //execute character movement function charWalk('direction')
			  switch(e.keyCode) {
				case 32: attackWeapon();    break;
				case 38: charWalk('up');    break;
				case 39: charWalk('right'); break;
				case 40: charWalk('down');  break;
				case 37: charWalk('left');  break;
				//Key "1"
				case 49: switchWeapon('#weapon-li-1');  break;
				//Key "2"
				case 50: switchWeapon('#weapon-li-2');  break;
				//Key "3"
				case 51: switchWeapon('#weapon-li-3');  break;
				//Key "4"
				case 52: 
				e.preventDefault();     
                e.stopPropagation();
				switchWeapon('#weapon-li-4');  break;
 
			  } 
    }
});

//KeyUp Function
$(document).keyup(function(e){
    //don't stop the walk if the player is pushing other buttons
    //only stop the walk if the key that started the walk is released
    if (e.keyCode == currentKey) {
      //set the currentKey to false, this will enable a new key to be pressed
      currentKey = false;
      //clear the walk timer
      clearInterval(TimerWalk);
      //finish the character's movement
     // $('#character').stop(true, true);
    }
});

//Character Walk Function
function charWalk(dir) {
    //adjust from lang to code
    if (dir == 'up') dir = 'back';
    if (dir == 'down') dir = 'front';
 
	lastDirection=dir;
    //move the character
    processWalk(dir);
	
	//setInterval (function1(){ function2(param)}, interval)
	
	//Interval needed when I keep the key pressed, so it keeps walking. Otherwise it will onlly do a step per pressure...
    //set the interval timer to continually execute the function that moves the character
    TimerWalk = setInterval(function() {
			processWalk(dir);
			//record the position...
			var xPosition= $('#character').css("left");
			var yPosition= $('#character').css("top");
			var charId=$("#character").data("charname");
			
			var orientation= $('#character').attr("class");
			console.log("X position is " +  xPosition);
			console.log("Y position is " +  yPosition);
			console.log("Orientation of the character is " + orientation );
			console.log("char id is  " + charId );
			moveArray={charId:charId, xPosition:xPosition, yPosition:yPosition,orientation:orientation };
			socket.emit("characterMoving", moveArray);//Send the info to socket io
		} 
		,charSpeed);
}
  
var previousLeft;
var previousTop;
//Process Character Walk Function
function processWalk(dir) {
    //increment the charStep as we will want to use the next stance in the animation
    //if the character is at the end of the animation, go back to the beginning
    charStep++;
    if (charStep == 5) charStep = 1;
    //remove the current class
    $('#character').removeAttr('class');
 
    //add the new class
    switch(charStep) {
      case 1: $('#character').addClass(dir+'-stand'); break;
      case 2: $('#character').addClass(dir+'-right'); break;
      case 3: $('#character').addClass(dir+'-stand'); break;
      case 4: $('#character').addClass(dir+'-left');  break;
    }
    //move the char
    //we will only want to move the character 32px (which is 1 unit) in any direction
	//How far I want to push "back" when he hits a wall the character...
	var var_top = 10;
	//If the stairs are open...
		// if(!collides.hits.length) {
		switch(dir) {
		case'front':
			previousTop=parseInt($( "#character" ).css('top'));
			previousLeft=parseInt($( "#character" ).css('left'));
			$( "#character" ).css( { top : "+=" + var_top + 'px'});
		
			if ($('#character').position().top > ((parseInt($( "#background" ).css('height')))    )) {
				mapDirection="DOWN";
				if(nextRoomReady){
						nextRoomReady=false;
						updateMap();
					}
			}
		break;
     
		case'back':
			//don't let the character move any further up if they are already at the top of the screen
			//Record the previous top and left position to see when I reach the limit...
			previousTop=parseInt($( "#character" ).css('top'));
			previousLeft=parseInt($( "#character" ).css('left'));
			$( "#character" ).css( { top : "-=" + var_top + 'px'});
			rightOk=true;
			if ($('#character').position().top < (30-parseInt($( "#character" ).css('width')))) {
				mapDirection="UP";
				if(nextRoomReady){
						nextRoomReady=false;
						updateMap();
					}			 
			}
		
        break;
		
		case'left':  
			previousTop=parseInt($( "#character" ).css('top'));
			previousLeft=parseInt($( "#character" ).css('left'));
			
			$( "#character" ).css( { left : "-=" + var_top + 'px'});
			rightOk=true;
			if ($('#character').position().left < (0-parseInt($( "#character" ).css('width')))) {
				////console.log("I found the exit from the left !!!!!!!!!!!!");
				mapDirection="LEFT";
				if(nextRoomReady){
						nextRoomReady=false;
						updateMap();
				}
			}        
		break;
		
		case'right':
			if(rightOk){
				previousTop=parseInt($( "#character" ).css('top'));
				previousLeft=parseInt($( "#character" ).css('left'));
				$( "#character" ).css( { left : "+=" + var_top + 'px'});
			
				if ($('#character').position().left > ((parseInt($( "#background" ).css('width'))) )) {
					mapDirection="RIGHT";				
					if(nextRoomReady){
						nextRoomReady=false;
						updateMap();
					}
					
				}
			
			}
        break;
      }
}