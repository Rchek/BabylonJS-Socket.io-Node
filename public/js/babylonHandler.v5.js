//Next thing -> add obj model for the displacement hero...
var nickname = prompt("what is your nickname ? ");
var random = (Math.random() * 100) + 1;
//var nickname="jeanjean-"+random;

var mySocketId = "none";
var sphereName;
var sphere;
var camera;
var currentKey; //records the current key pressed
var TimerFrontBack;
var TimerRightLeft;
var charStep = 2; //1=1st foot, 2=stand, 3=2nd foot, 4=stand
var charSpeed = 50; //how fast the character will move
var gap = 15;
var rightOk = true;
var scene;
var randomR;
var randomV;
var randomB;
var botSphere;
var mainSphere;
var loader;
var engine;
var originalMesh;
var speed = 0.1
var botsCount=0;

//Forward or backward
var Firstkey = false
    //Right or left
var SecondKey = false;
window.addEventListener('DOMContentLoaded', function() {


	
	
    var canvas = document.getElementById('renderCanvas');
	
	
    engine = new BABYLON.Engine(canvas, true);
	//Get framerate everyframe
/*
	var getFramerate =setInterval(function(){
	console.log("Framerate is " +Math.round(engine.getFps()));
}, 500);
	*/	
    var createScene = function() {
        scene = new BABYLON.Scene(engine);
        camera = new BABYLON.ArcRotateCamera('ArcRotateCamera', 0.8, 1.2, 1, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(canvas);
        // create a basic light, aiming 0,1,0 - meaning, to the sky
        var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 0.1, 0), scene);
        // create a built-in "ground" shape; its constructor takes the same 5 params as the sphere's one
        var ground = BABYLON.Mesh.CreateGround('ground1', 50, 50, 2, scene);
        ground.material = new BABYLON.StandardMaterial("texture2", scene);
        ground.material.diffuseColor = new BABYLON.Color3(0.2, 0.8, 0.5);
        ground.material = new BABYLON.StandardMaterial("texture2", scene);
        ground.material.diffuseTexture = new BABYLON.Texture("texture_two.jpg", scene);
        ground.material.diffuseTexture.uScale = 6.0;
        ground.material.diffuseTexture.vScale = 6.0;
        return scene;
    }

    // call the createScene function
    scene = createScene();
    // run the render loop
    engine.runRenderLoop(function() {
        scene.render();
    });
    // the canvas/window resize event handler
    window.addEventListener('resize', function() {
        engine.resize();
    });
    loader = new BABYLON.AssetsManager(scene);
    //originalMesh= loader.addMeshTask('sphere-', "", "./obj/", "stardust.obj");
    originalMesh = loader.addMeshTask('sphere-', "", "./obj/", "stardustModelMergedPivot.obj");
    loader.load();
    loader.onFinish = function(originalMesh) {
		console.log("loader finish");
        //The archetype model become the character used by the player...
        mainSphere = scene.meshes[1];
        mainSphere.name = nickname;
		console.log("nickname is " + mainSphere);
        socket.emit('newuser', nickname);
    }

});

//If I close tab -> so, if I disconnect
window.onbeforeunload = function() {
    //socket.emit("user-gone", nickname);
    var goneObj = {
        nickname: nickname,
        socketId: mySocketId
    };
    //alert("before I emit = socket id is " + goneObj.socketId);
    socket.emit("user-gone", goneObj);
    return null;
    //return "Do you really want to close?";
};

socket.on('loadModel', function(mess) {

});
//Add users
socket.on('update-users', function(arrayOfUsers) {
    //console.log("show me mesh scene " + JSON.stringify(scene.meshes));
   // var lengthofMesh = scene.meshes.length - 1;
    console.log("KEEP USER " + nickname);

    //Index 0 for ground, Index 1 for main character...
    //SO I pop until their's only the mnain elements on the scene
    while (scene.meshes.length > 2) {
        scene.meshes[2].dispose();
    }
 
    //Make a loop of creations of all the avatars
    for (var i = 0; i <= arrayOfUsers.users.length - 1; i++) {
        //if current user is nickname, create sphere,
        if (arrayOfUsers.users[i].nickname == nickname) {
            console.log("babylon color gives" + arrayOfUsers.users[i].nickname);
            mySocketId = arrayOfUsers.users[i].socketId;
            mainSphere.position.z = arrayOfUsers.users[i].zBabylon;
            mainSphere.position.x = arrayOfUsers.users[i].xBabylon;
            mainSphere.position.y = arrayOfUsers.users[i].yBabylon;
            mainSphere.rotation.y = arrayOfUsers.users[i].yBabylonRotation;
            mainSphere.material = new BABYLON.StandardMaterial("texture1", scene);
            mainSphere.material.diffuseColor = new BABYLON.Color3(arrayOfUsers.users[i].colorR, arrayOfUsers.users[i].colorV, arrayOfUsers.users[i].colorB);
            camera.radius = 5;
			camera.target = mainSphere.position;
			//camera.setTarget(mainSphere.position);
			//camera.lockedtarget=mainSphere;
			console.log("name of sphere is "  +mainSphere.name);
			
        } else {
			//Make bots
            botSphere = mainSphere.clone(arrayOfUsers.users[i].nickname);
            botSphere.material = new BABYLON.StandardMaterial("texture-" + arrayOfUsers.users[i].nickname, scene);
            botSphere.material.diffuseColor = new BABYLON.Color3(arrayOfUsers.users[i].colorR, arrayOfUsers.users[i].colorV, arrayOfUsers.users[i].colorB);
            botSphere.position.x = arrayOfUsers.users[i].xBabylon;
            botSphere.position.z = arrayOfUsers.users[i].zBabylon;
            botSphere.position.y = arrayOfUsers.users[i].yBabylon;
            botSphere.rotation.y = arrayOfUsers.users[i].yBabylonRotation;
			botsCount++;
        }
        //And for the others create them as well, but with not control, or camera...
    }
});



//Ajouter des elements sur lesques interagir


 
//When click event is raised
window.addEventListener("click", function (evt) {
   // We try to pick an object
   var pickResult = scene.pick(evt.clientX, evt.clientY);
   var indices = pickResult.pickedMesh.getIndices();
   if(pickResult.hit){
	console.log("I hit something and it is " + JSON.stringify(pickResult.pickedMesh.name));
 
	//Find index of element in the scene...
	for(var p=0;p<=scene.meshes.length-1;p++){
	 if(scene.meshes[p].name==pickResult.pickedMesh.name){
	 console.log("must erase " +scene.meshes[p].name);
		//scene.meshes[p].dispose();
	 }
	}
	
   }
   
});


//Keydown event, handling dirctions keys separately		
$(document).keydown(function(e) {
    //First key second key
    //One key at a time...
    if (!Firstkey && (e.keyCode == 104 || e.keyCode == 101)) {
        //set the currentKey to the key that is down
        Firstkey = e.keyCode;
        //execute character movement function charWalk('direction')
        switch (e.keyCode) {
            case 104:
                charWalk('up');
                break;
            case 101:
                charWalk('down');
                break;
        }
    }
    //One key at a time...
    if (!SecondKey && (e.keyCode == 102 || e.keyCode == 100)) {
       // console.log("set sedone key");
        //set the currentKey to the key that is down
        SecondKey = e.keyCode;
        //execute character movement function charWalk('direction')
        switch (e.keyCode) {
            case 102:
                charWalk('right');
                break;
            case 100:
                charWalk('left');
                break;
        }
    }
});

//KeyUp Function
$(document).keyup(function(e) {
    //don't stop the walk if the player is pushing other buttons
    //only stop the walk if the key that started the walk is released
    if (e.keyCode == Firstkey) {
        //set the currentKey to false, this will enable a new key to be pressed
        Firstkey = false;
        clearInterval(TimerFrontBack);
    } else if (e.keyCode == SecondKey) {
        SecondKey = false;
        clearInterval(TimerRightLeft);
    }
});

//Character Walk Function
function charWalk(dir) {
    //adjust from lang to code
    if (dir == 'up') dir = 'front';
    if (dir == 'down') dir = 'back';
    lastDirection = dir;
    //move the character
    processWalk(dir);
    //set the interval timer to continually execute the function that moves the character
    if (dir == "front" || dir == "back") {
        TimerFrontBack = setInterval(function() {
            processWalk(dir);
            //record the position...	
            moveArray = {
                nickname: nickname,
                xBabylon: mainSphere.position.x,
                zBabylon: mainSphere.position.z,
                yBabylon: mainSphere.position.y,
                yBabylonRotation: mainSphere.rotation.y
            };
            socket.emit("babylonMoving", moveArray); //Send the info to socket io
        }, charSpeed);
        // 
    }
    if (dir == "right" || dir == "left") {
        TimerRightLeft = setInterval(function() {
            processWalk(dir);
            //record the position...	
            moveArray = {
                nickname: nickname,
                xBabylon: mainSphere.position.x,
                zBabylon: mainSphere.position.z,
                yBabylon: mainSphere.position.y,
                yBabylonRotation: mainSphere.rotation.y
            };
            socket.emit("babylonMoving", moveArray); //Send the info to socket io
        }, charSpeed);
    }
}

function processWalk(dir) {
	
    //we will only want to move the character 32px (which is 1 unit) in any direction
    //How far I want to push "back" when he hits a wall the character...
    var var_top = 10;
    switch (dir) {
        case "front":
            mainSphere.translate(BABYLON.Axis.Z, speed, BABYLON.Space.LOCAL);
            break;
        case "back":
            mainSphere.translate(BABYLON.Axis.Z, -speed, BABYLON.Space.LOCAL);
            break;
        case "right":
            mainSphere.rotation.y += speed;
            break;
        case "left":
            mainSphere.rotation.y -= speed;
            break;
    }
}

//update other bots positions
socket.on("update-positions", function(usersObj) {
    //console.log("update position" +scene.meshes.length );
    for (var i = 0; i <= usersObj.users.length - 1; i++) {
        if (usersObj.users[i].nickname != nickname) {
            //Update the position
            for (var j = 0; j <= scene.meshes.length - 1; j++) {
                //I find the right mesh on the scene...
                if (scene.meshes[j].name == usersObj.users[i].nickname) {
                    scene.meshes[j].position.x = usersObj.users[i].xBabylon;
                    scene.meshes[j].position.z = usersObj.users[i].zBabylon;
                    scene.meshes[j].position.y = usersObj.users[i].yBabylon;
                    scene.meshes[j].rotation.y = usersObj.users[i].yBabylonRotation;
                }
            }
        }
    }
});