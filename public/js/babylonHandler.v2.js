
//Next thing -> add obj model for the displacement hero...

	var nickname=prompt("what is your nickname ? ");
	socket.emit('newuser' , nickname);
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
	window.addEventListener('DOMContentLoaded', function(){
            // get the canvas DOM element
            var canvas = document.getElementById('renderCanvas');

            // load the 3D engine
            engine = new BABYLON.Engine(canvas, true);

            // createScene function that creates and return the scene
            var createScene = function(){
                // create a basic BJS Scene object
                scene = new BABYLON.Scene(engine);
                camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 10,-30), scene);
				
				//Intialize the obj handler
				loader= new BABYLON.AssetsManager(scene);
				 
				   
                // create a basic light, aiming 0,1,0 - meaning, to the sky
                var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,0.1,0), scene);
                // create a built-in "ground" shape; its constructor takes the same 5 params as the sphere's one
                var ground = BABYLON.Mesh.CreateGround('ground1',50, 50, 2, scene);
				ground.material = new BABYLON.StandardMaterial("texture2", scene);
				ground.material.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.8);
				ground.material = new BABYLON.StandardMaterial("texture2", scene);
				 ground.material.diffuseTexture = new BABYLON.Texture("texture_one.jpg", scene);
				//camera.lockedtarget=ground;
                // return the created scene
				//Create original MESH
				
				 // mainSphere=originalMesh.createInstance('sphere-'+nickname);
 
				
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
		
			//Add users
			socket.on('update-users',function(arrayOfUsers){
			var lengthofMesh=scene.meshes.length-1;
			console.log("update users");
				//console.log("users are " + JSON.stringify(arrayOfUsers));
				for(var z=1;z<=lengthofMesh;z++){
					 console.log("remove this mesh " + z);
					 console.log(" the dispose mesh number " + z);
					 scene.meshes[1].dispose() ;
					//mainSphere.dispose();
				}

				console.log("how many users ??? " +arrayOfUsers.users.length);
				//Make a loop of creations of all the avatars
				for(var i=0;i<=arrayOfUsers.users.length-1;i++){
				randomR=Math.random().toFixed(2);
				randomV=Math.random().toFixed(2);
				randomB=Math.random().toFixed(2);
				
					//if current user is nickname, create sphere,
					if(arrayOfUsers.users[i].nickname==nickname){
					
					//console.log("babylon color gives" + arrayOfUsers.users[i].babylonColor);
						mySocketId=arrayOfUsers.users[i].socketId;
						//Make sphere
						
						
					 originalMesh= loader.addMeshTask('sphere-'+arrayOfUsers.users[i].nickname, "", "./obj/", "stardust.obj");
					 // loader.load();

				// originalMesh = loader.addMeshTask('originalMesh', "", "./obj/", "stardust.obj");  
				 console.log("i equals " + i);
				 
				 
				  loader.onFinish = function() {
				  // console.log("mesh loaded with this array " +  JSON.stringify(arrayOfUsers));
				  console.log("mesh loaded with this index  " +  arrayOfUsers.users[i]);
				    //I make the main Mesh Only now...
					mainSphere=scene.meshes[scene.meshes.length-1];
					mainSphere.name=nickname;
					//mainSphere.position.x=arrayOfUsers.users[i].xBabylon;
					/*	mainSphere.position.z=arrayOfUsers.users[i].zBabylon;
						mainSphere.position.y =5;
						mainSphere.material = new BABYLON.StandardMaterial("texture1", scene);
						mainSphere.material.diffuseColor = new BABYLON.Color3( arrayOfUsers.users[i].colorR,arrayOfUsers.users[i].colorV,arrayOfUsers.users[i].colorB);
*/
					 for (var a=0; a <11; a++) {  
						var newInstance = mainSphere.createInstance("index: " +a);
						//console.log("make new for " + a);
						newInstance.position.z =+ a*2;
						}
						
					//console.log("length of the meshes" + scene.meshes.length);
					  
					
					/*console.log("id is " +  mainSphere.name);
					mainSphere.name="bibou";
					console.log("id is now" +  mainSphere.name);
					 */
					
 
					}
						 
					 console.log("i equals  THEN" + i);	  
						 
							//var newInstance = originalMesh.createInstance("index: " ); 
					


						
						
					//Target the mesh for future use...
					//mainSphere=scene.meshes[1];
						 
					loader.load();
						 
        //  return scene; 
						 
						//mainSphere=new BABYLON.Mesh.CreateSphere('sphere-'+arrayOfUsers.users[i].nickname, 1, 3, scene);
						/* mainSphere.position.x=arrayOfUsers.users[i].xBabylon;
						mainSphere.position.z=arrayOfUsers.users[i].zBabylon;
						mainSphere.position.y =5;
						mainSphere.material = new BABYLON.StandardMaterial("texture1", scene);
						mainSphere.material.diffuseColor = new BABYLON.Color3( arrayOfUsers.users[i].colorR,arrayOfUsers.users[i].colorV,arrayOfUsers.users[i].colorB);*/
					 
					}
					else{
						/*botSphere= new BABYLON.Mesh.CreateSphere('sphere-'+arrayOfUsers.users[i].nickname, 1, 3, scene);
						botSphere.position.x=arrayOfUsers.users[i].xBabylon;
						botSphere.position.z=arrayOfUsers.users[i].zBabylon;
						botSphere.position.y = 1.5;
						botSphere.material = new BABYLON.StandardMaterial("texture1", scene);
						botSphere.material.diffuseColor = new BABYLON.Color3( arrayOfUsers.users[i].colorR,arrayOfUsers.users[i].colorV,arrayOfUsers.users[i].colorB);
						*/
					}
					//And for the others create them as well, but with not control, or camera...
				}
				
				camera.lockedtarget=mainSphere;
				//console.log("LENGTH IS AFTER   CAM" + scene.meshes.length );
				/*
				//Animation
				var animationBox = new BABYLON.Animation("myAnimation", "position.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
				// An array with all animation keys
				var keys = []; 

				 //At the animation key 0, the value of scaling is "1"
				 keys.push({
				   frame: 0,
				   value: 1,
 
				 });

				 //At the animation key 20, the value of scaling is "0.2"
				 keys.push({
				   frame: 50,
				   value: 3
				 });

				 //At the animation key 100, the value of scaling is "1"
				 keys.push({
				   frame: 100,
				   value: 1
				 });
				
				animationBox.setKeys(keys);
				sphere.animations.push(animationBox);
				scene.beginAnimation(sphere, 0, 100, true);
				//Make a babylon X and Babylon Y position...
				*/
				
		});
		
		
		//Movement handler
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
    if (dir == 'up') dir = 'front';
    if (dir == 'down') dir = 'back';
 
	lastDirection=dir;
    //move the character
    processWalk(dir);
    //set the interval timer to continually execute the function that moves the character
    TimerWalk = setInterval(function() {
			processWalk(dir);
			//record the position...
			moveArray={nickname:nickname, xBabylon:mainSphere.position.x, zBabylon:mainSphere.position.z };
			socket.emit("babylonMoving", moveArray);//Send the info to socket io
			//console.log("Z-position is " + mainSphere.position.z);
			//console.log("X-position is " + mainSphere.position.x);
			
		} 
		,charSpeed);
}

function processWalk(dir) {
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
		mainSphere.position.z += 0.4;
		camera.position.z += 0.4;
		break;
		case "back":
		mainSphere.position.z -= 0.4;
		camera.position.z -= 0.4;
		break;
		case "right":
		mainSphere.position.x += 0.4;
		camera.position.x += 0.4;
		break;
		case "left":
		mainSphere.position.x -= 0.4;
		camera.position.x -= 0.4;
		break;
      }
}

	$(".button.dispose-btn").click(function(){
		//Erase all users...
		console.log("I clicked the dispose BTN");
		botSphere.dispose() ;
		mainSphere.dispose();
	});
	
	
	//update other bots positions
	socket.on("update-positions", function(usersObj){
	
	
	
	console.log("length is  NOW" +scene.meshes.length );
		for(var i=0;i<=usersObj.users.length-1;i++){
		
		
		if(usersObj.users[i].nickname!=nickname){
			//Update the position
			for(var j=0;j<=scene.meshes.length-1;j++){
				//I find the right mesh on the scene...
				if(scene.meshes[j].name=="sphere-"+usersObj.users[i].nickname){
						scene.meshes[j].position.x=usersObj.users[i].xBabylon;
						scene.meshes[j].position.z=usersObj.users[i].zBabylon;
				}
			}
		}
	
		}
	});