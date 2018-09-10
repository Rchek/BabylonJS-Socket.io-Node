
//Next thing -> add obj model for the displacement hero...

	//var nickname=prompt("what is your nickname ? ");
	var nickname="jeanjean";
	
	var mySocketId="none";
	var sphereName;
	
	var sphere;
	var camera ;
	var currentKey;          //records the current key pressed
	var TimerWalk;    
	var charStep = 2;       //1=1st foot, 2=stand, 3=2nd foot, 4=stand
	var charSpeed = 50; //how fast the character will move
	var gap=15;
	var rightOk=true;
	var scene;
	var randomR;
	var randomV;
	var randomB;
	var botSphere;
	var mainSphere;
	var loader;
     var engine;
	 var originalMesh;
	 var speed=0.1;
	window.addEventListener('DOMContentLoaded', function(){
            // get the canvas DOM element
            var canvas = document.getElementById('renderCanvas');

            // load the 3D engine
            engine = new BABYLON.Engine(canvas, true);
            // createScene function that creates and return the scene
            var createScene = function(){
                // create a basic BJS Scene object
                scene = new BABYLON.Scene(engine);
                //camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(5, 3,-8), scene);
               //camera = new BABYLON.ArcRotateCamera('ArcRotateCamera', 0, 0,0, BABYLON.Vector3.Zero(), scene);
               camera = new BABYLON.ArcRotateCamera('ArcRotateCamera', 0.8, 1.2,1, BABYLON.Vector3.Zero(), scene);
               //camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0,0,0), scene);
				 camera.attachControl(canvas);
			
				 
				   
                // create a basic light, aiming 0,1,0 - meaning, to the sky
                var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,0.1,0), scene);
                // create a built-in "ground" shape; its constructor takes the same 5 params as the sphere's one
                var ground = BABYLON.Mesh.CreateGround('ground1',50, 50, 2, scene);
				ground.material = new BABYLON.StandardMaterial("texture2", scene);
				ground.material.diffuseColor = new BABYLON.Color3(0.2, 0.8, 0.5);
				ground.material = new BABYLON.StandardMaterial("texture2", scene);
				 ground.material.diffuseTexture = new BABYLON.Texture("texture_two.jpg", scene);
				 ground.material .diffuseTexture.uScale = 6.0;
				 ground.material .diffuseTexture.vScale = 6.0;
                return scene;
				//Change position with click for example...
				//Regarder pour les collisions, sprites, etc...
            }

            // call the createScene function
           scene = createScene();
            // run the render loop
            engine.runRenderLoop(function(){
                scene.render();
            });
            // the canvas/window resize event handler
            window.addEventListener('resize', function(){
                engine.resize();
            });
				console.log("DOM CONTENT ");
				 loader= new BABYLON.AssetsManager(scene);
				 //originalMesh= loader.addMeshTask('sphere-', "", "./obj/", "stardust.obj");
				 originalMesh= loader.addMeshTask('sphere-', "", "./obj/", "stardustModelMergedPivot.obj");
				 loader.load(); 
				 loader.onFinish = function(originalMesh) {
				 //The archetype model become the character used by the player...
				 mainSphere=scene.meshes[1];
				 mainSphere.name=nickname;
				 socket.emit('newuser' , nickname);
			}
			
	    });
		
		//If I close tab -> so, if I disconnect
		window.onbeforeunload = function () {
				//socket.emit("user-gone", nickname);
				var goneObj={nickname:nickname, socketId: mySocketId};
				//alert("before I emit = socket id is " + goneObj.socketId);
				socket.emit("user-gone", goneObj);
				return null;
				//return "Do you really want to close?";
			};
			
			socket.on('loadModel' , function(mess){
					 
			});
			//Add users
			socket.on('update-users',function(arrayOfUsers){
			var lengthofMesh=scene.meshes.length-1;
			console.log("update users or remove them ");
				//console.log("users are " + JSON.stringify(arrayOfUsers));
				for(var z=1;z<=lengthofMesh;z++){
					 console.log("remove this mesh " + scene.meshes[z].name);
					 console.log(" the dispose mesh number " + z);
					 if(scene.meshes[z].name!=nickname){
						scene.meshes[z].dispose() ;
					 }
					// console.log("how many elements on stage now " + JSON.stringify(scene.meshes));
					 console.log("how many users ???  " +  JSON.stringify(arrayOfUsers));
					 //Dispose only the bots, to keep the original...
					//  scene.meshes[1].dispose() ;
					//mainSphere.dispose();
				}


				//Make a loop of creations of all the avatars
				for(var i=0;i<=arrayOfUsers.users.length-1;i++){
					//if current user is nickname, create sphere,
					if(arrayOfUsers.users[i].nickname==nickname){
					
					//console.log("babylon color gives" + arrayOfUsers.users[i].babylonColor);
						mySocketId=arrayOfUsers.users[i].socketId;
						mainSphere.position.z=arrayOfUsers.users[i].zBabylon;
						//mainSphere.position.y =0;
						mainSphere.position.x=arrayOfUsers.users[i].xBabylon;
						mainSphere.position.y=arrayOfUsers.users[i].yBabylon;
						mainSphere.rotation.y=arrayOfUsers.users[i].yBabylonRotation;
						mainSphere.material = new BABYLON.StandardMaterial("texture1", scene);
						mainSphere.material.diffuseColor = new BABYLON.Color3( arrayOfUsers.users[i].colorR,arrayOfUsers.users[i].colorV,arrayOfUsers.users[i].colorB);
						//camera.lockedtarget=mainSphere;
						//camera.setTarget(mainSphere.position);
						//camera.setTarget(mainSphere.position);
						
						//move pivot...
						//mainSphere.translate(BABYLON.Axis.Y, 35, BABYLON.Space.LOCAL);
						
						 camera.target = mainSphere;
						//camera.setPosition(new BABYLON.Vector3(0, 4, -10));
						//camera.target =  new BABYLON.Vector3(mainSphere.position.x, mainSphere.position.y, mainSphere.position.z);
						//camera.target =  new BABYLON.Vector3(10, 10, 10);
						camera.radius = 5;
						/*camera.rotationOffset = 180;
						camera.heightOffset = 4;
						camera.cameraAcceleration = 0.01 // how fast to move
						camera.maxCameraSpeed = 10 // speed limit 
						*/
						//camera.setTarget(new BABYLON.Vector3(0, 15, -30));
					 
					}
					else{
					
						//The bots are clones or instances. If I use instance, the same material will be applied to all instances. I must use clones instead to be able
						//to use individual materials.
						botSphere= mainSphere.createInstance(arrayOfUsers.users[i].nickname);
						botSphere.position.x=arrayOfUsers.users[i].xBabylon;
						botSphere.position.z=arrayOfUsers.users[i].zBabylon;
						botSphere.position.y = arrayOfUsers.users[i].yBabylon;
						botSphere.rotation.y = arrayOfUsers.users[i].yBabylonRotation;
					}
					//And for the others create them as well, but with not control, or camera...
				}

				//console.log("LENGTH IS AFTER   CAM" + scene.meshes.length );
				//Animation
				var animationBox = new BABYLON.Animation("myAnimation", "position.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
				// An array with all animation keys
				var keys = []; 
				//At the animation key 0, the value of scaling is "1"
				keys.push({
				   frame: 0,
				   value: 0,
 
				 });

				 //At the animation key 20, the value of scaling is "0.2"
				 keys.push({
				   frame: 30,
				   value: 0.5
				 });

				 //At the animation key 100, the value of scaling is "1"
				 keys.push({
				   frame: 60,
				   value: 0
				 });
				
				//animationBox.setKeys(keys);
				//mainSphere.animations.push(animationBox);
				//scene.beginAnimation(mainSphere, 0, 100, true);
				//Make a babylon X and Babylon Y position...
			 
				
		});
		
		//Movement handler
		$(document).keydown(function(e) {
		  console.log("the current key is "+ e.keyCode);
		
		
		//One key at a time...
		 // if (!currentKey) {   
		  //set the currentKey to the key that is down
		  currentKey = e.keyCode;
		 
				  //execute character movement function charWalk('direction')
				  switch(e.keyCode) {
					case 32: attackWeapon();    break;
					/*
					case 38: charWalk('up');    break;
					case 39: charWalk('right'); break;
					case 40: charWalk('down');  break;
					case 37: charWalk('left');  break;
					*/
					case 104: charWalk('up');    break;
					case 102: charWalk('right'); break;
					case 101: charWalk('down');  break;
					case 100: charWalk('left');  break;
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
		  //}
});
		
		//KeyUp Function
		$(document).keyup(function(e){
			  currentKey = false;
			  //clear the walk timer
			  clearInterval(TimerWalk);
			  
			  charWalk("stop");
			//don't stop the walk if the player is pushing other buttons
			//only stop the walk if the key that started the walk is released
			
			/*if (e.keyCode == currentKey) {
			  console.log("stop propagatopn...");
			  //set the currentKey to false, this will enable a new key to be pressed
			  currentKey = false;
			  //clear the walk timer
			  clearInterval(TimerWalk);
			  //finish the character's movement68
			 // $('#character').stop(true, true);
			}
			*/
			
		});
		
		
//Character Walk Function
function charWalk(dir) {
    //adjust from lang to code
    if (dir == 'up') dir = 'front';
    if (dir == 'down') dir = 'back';
 
	lastDirection=dir;
	
	console.log("current key is in charwalk " + currentKey  + " and the dir is " + dir);
    //move the character
	if(dir!="stop"){
	//console.log("dir shoule bs stop but is " + dir);
	    processWalk(dir);
		//set the interval timer to continually execute the function that moves the character
		 TimerWalk = setInterval(function() {
				processWalk(dir);
				//record the position...	
				console.log("in interval ");
				 moveArray={nickname:nickname, xBabylon:mainSphere.position.x, zBabylon:mainSphere.position.z , yBabylon:mainSphere.position.y,yBabylonRotation:mainSphere.rotation.y  };
				socket.emit("babylonMoving", moveArray);//Send the info to socket io
				//console.log("Z-position is " + mainSphere.position.z);
				//console.log("X-position is " + mainSphere.position.x);
			} 
			,charSpeed);
			 
	}
	else{
		console.log("stop interval");
		  clearInterval(TimerWalk);
		  clearInterval(TimerWalk);
	}
		
		
}

 
 

function processWalk(dir) {
console.log("wow...  with " + currentKey + "and speed is " + speed);
//clearInterval(TimerWalk);
if(!currentKey){
dir="null";
console.log("dir is null");
	console.log("rotation is " + mainSphere.rotation.y);
  console.log("clear interval");
  clearInterval(TimerWalk);
return;
 
}
	
	// return;
for(var k=0;k<=scene.meshes.length-1;k++){
			//console.log("name is NOW " +scene.meshes[k].name + "with length of "  +   scene.meshes.length );
			//console.log("name is NOW " + scene.meshes[k].id );
			}
    //console.log("nbame is  AFTER" + mainSphere.name);  
    //increment the charStep as we will want to use the next stance in the animation
    //if the character is at the end of the animation, go back to the beginning
	//console.log("firection is " + dir);
    //move the char
    //we will only want to move the character 32px (which is 1 unit) in any direction
	//How far I want to push "back" when he hits a wall the character...
	var var_top = 10;
	//If the stairs are open...
		// if(!collides.hits.length) {
		switch(dir) {
		case "front":
		//mainSphere.position.z += 0.4;
		mainSphere.translate(BABYLON.Axis.Z, speed, BABYLON.Space.LOCAL);
		//camera.position.z += 0.4;
		break;
		case "back":
		mainSphere.translate(BABYLON.Axis.Z, -speed, BABYLON.Space.LOCAL);
		//mainSphere.position.z -= 0.4;
		//camera.position.z -= 0.4;
		break;
		case "right":
		//mainSphere.position.x += 0.4;
		//pilot.rotation.x 
		//mainSphere.rotate(BABYLON.Axis.Y, speed, BABYLON.Space.LOCAL);
		mainSphere.rotation.y+=speed;
		//console.log("rotation is now " + mainSphere.rotation);
		//camera.rotate(BABYLON.Axis.Y, 0.4, BABYLON.Space.WORLD);
		//mainSphere.rotation.y += 0.4;
		//camera.position.x += 0.4;
		break;
		case "left":
		//mainSphere.rotate(BABYLON.Axis.Y, -speed, BABYLON.Space.LOCAL);
		mainSphere.rotation.y-=speed;
		//console.log("rotation is now " + mainSphere.rotation);
		//mainSphere.position.x -= 0.4;
		//mainSphere.rotation.y -= 0.4;
		//camera.position.x -= 0.4;
		break;
      }
}
	
	//update other bots positions
	socket.on("update-positions", function(usersObj){
		//console.log("update position" +scene.meshes.length );
		for(var i=0;i<=usersObj.users.length-1;i++){		
		if(usersObj.users[i].nickname!=nickname){
			//Update the position
			for(var j=0;j<=scene.meshes.length-1;j++){
				//I find the right mesh on the scene...
				if(scene.meshes[j].name==usersObj.users[i].nickname){
						scene.meshes[j].position.x=usersObj.users[i].xBabylon;
						scene.meshes[j].position.z=usersObj.users[i].zBabylon;
						scene.meshes[j].position.y=usersObj.users[i].yBabylon;
						scene.meshes[j].rotation.y=usersObj.users[i].yBabylonRotation;
				}
			}
		}
		}
	});