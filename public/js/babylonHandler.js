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
var stardustIndex;


var screen;
var cctv;
var cctvRay;

//Texture for names of characters
var botLabelTexture;
var stardustLabelTexture;
//var dynamicMaterialStardust;
var dynamicMaterialStardust;
var stardustNamePlaneLabel;


//Forward or backward
var Firstkey = false
    //Right or left
var SecondKey = false;
window.addEventListener('DOMContentLoaded', function() {

    var canvas = document.getElementById('renderCanvas');	
    engine = new BABYLON.Engine(canvas, true);
	//Get framerate everyframe
 
		var getFramerate =setInterval(function(){
		// console.log("Framerate is " +Math.round(engine.getFps()));
		cctvRay.rotation.y += speed;
		 
	}, 50);
	 
		var createScene = function() {
        scene = new BABYLON.Scene(engine);
        camera = new BABYLON.ArcRotateCamera('ArcRotateCamera', 0.8, 1.2, 1, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(canvas);
        // create a basic light, aiming 0,1,0 - meaning, to the sky
        var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 0.1, 0), scene);
        // create a built-in "ground" shape; its constructor takes the same 5 params as the sphere's one
        var ground = BABYLON.Mesh.CreateGround('ground1', 50, 50, 2, scene);
		//var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "texture_four.jpg", 100, 100, 100, 0, 10, scene, false);
        ground.material = new BABYLON.StandardMaterial("texture2", scene);
        ground.material.diffuseColor = new BABYLON.Color3(0.2, 0.8, 0.5);
        ground.material = new BABYLON.StandardMaterial("texture2", scene);
        ground.material.diffuseTexture = new BABYLON.Texture("texture_four.jpg", scene);
        ground.material.diffuseTexture.uScale = 6.0;
        ground.material.diffuseTexture.vScale = 6.0;
		ground.material.wireframe = true;
		
		//Add screens
		//Add CCTV with ray
		//Add printer
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
	
	//Screen (Or main screen)
	screenLoader = new BABYLON.AssetsManager(scene);
    originalScreenMesh = screenLoader.addMeshTask('screen', "", "./obj/", "screen.obj");
    screenLoader.load();
	
	screenLoader.onFinish = function( ) {
	screen=scene.meshes[scene.meshes.length-1];
	screen.material = new BABYLON.StandardMaterial("texture1", scene);
	screen.material.wireframe = true;
    screen.material.diffuseColor = new BABYLON.Color3(240, 127, 94);
	}
	
	
	//CCTV
	cctvLoader = new BABYLON.AssetsManager(scene);
    originalCctvMesh = cctvLoader.addMeshTask('screen', "", "./obj/", "cam_cctv.obj");
    cctvLoader.load();
	
	cctvLoader.onFinish = function( ) {
	//console.log("how many objects " + scene.meshes.length);
    console.log("CCTV added ");
	cctv=scene.meshes[scene.meshes.length-1];
	cctv.material = new BABYLON.StandardMaterial("texture1", scene);
	cctv.material.wireframe = true;
    cctv.material.diffuseColor = new BABYLON.Color3(240, 127, 94);

	cctv.position=new BABYLON.Vector3(2,2,2);
		console.log("CCTV position " + cctv.position);
	}
	
	//CCTV RAY
	cctvRayLoader = new BABYLON.AssetsManager(scene);
    originalCctvRayMesh = cctvRayLoader.addMeshTask('screen', "", "./obj/", "cam_ray.obj");
    cctvRayLoader.load();
	
	cctvRayLoader.onFinish = function( ) {
	//console.log("how many objects " + scene.meshes.length);
    console.log("CCTV RAY  added ");
	cctvRay=scene.meshes[scene.meshes.length-1];
	cctvRay.material = new BABYLON.StandardMaterial("texture1", scene);
	cctvRay.material.wireframe = true;
    cctvRay.material.diffuseColor = new BABYLON.Color3(240, 127, 94);

	cctvRay.position=new BABYLON.Vector3(2,2,2);
	cctvRay.rotation=new BABYLON.Vector3(90,90,90);
	console.log("CCTV positio " + cctvRay.position);
	}
	
	
	//Main Character (not other players)
    loader = new BABYLON.AssetsManager(scene);
    //originalMesh= loader.addMeshTask('sphere-', "", "./obj/", "stardust.obj");
    originalMesh = loader.addMeshTask('sphere-', "", "./obj/", "stardustModelMergedPivot.obj");
    loader.load();
    loader.onFinish = function(originalMesh) {
		for(var h=0;h<=scene.meshes.length-1;h++){
			if(scene.meshes[h].name=="StardustModel"){
			stardustIndex=h;
			}
		}
        //The archetype model become the character used by the player...
        mainSphere = scene.meshes[stardustIndex];
        mainSphere.name = nickname;
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
   //Index 0 for ground, Index 1 for main character...
   //SO I pop until their's only the mnain elements on the scene
   while (scene.meshes.length > stardustIndex+1) {
       scene.meshes[stardustIndex+1].dispose();
   }
 
   //Make a loop of creations of all the avatars
   for (var i = 0; i <= arrayOfUsers.users.length - 1; i++) {
        //if current user is nickname, create sphere,
        if (arrayOfUsers.users[i].nickname == nickname) {
            mySocketId = arrayOfUsers.users[i].socketId;
            mainSphere.position.z = arrayOfUsers.users[i].zBabylon;
            mainSphere.position.x = arrayOfUsers.users[i].xBabylon;
            mainSphere.position.y = arrayOfUsers.users[i].yBabylon;
            mainSphere.rotation.y = arrayOfUsers.users[i].yBabylonRotation;
            mainSphere.material = new BABYLON.StandardMaterial("texture1", scene);
			mainSphere.material.wireframe = true;
            mainSphere.material.diffuseColor = new BABYLON.Color3(arrayOfUsers.users[i].colorR, arrayOfUsers.users[i].colorV, arrayOfUsers.users[i].colorB);
            camera.radius = 5;
			camera.target = mainSphere.position;
			//Add name on top of character
			stardustLabelTexture = new BABYLON.DynamicTexture("dynamic texture", 200, scene, true);
			dynamicMaterialStardust = new BABYLON.StandardMaterial('mat', scene);
			dynamicMaterialStardust.diffuseTexture = stardustLabelTexture;
			//dynamicMaterialStardust.specularColor = new BABYLON.Color3(200, 200, 200);
			dynamicMaterialStardust.backFaceCulling = false;
			
			stardustNamePlaneLabel = BABYLON.Mesh.CreatePlane("plane",0.5, scene);
			//stardustNamePlaneLabel = BABYLON.Mesh.CreateBox("box", 0.5, scene);
			stardustNamePlaneLabel.scaling.y=0.5;
			stardustNamePlaneLabel.scaling.z=0.1;
			stardustNamePlaneLabel.position.y=1.8;
			var text =arrayOfUsers.users[i].nickname;
			 
			stardustNamePlaneLabel.rotation.y=3.2;
			
			var context = stardustLabelTexture._context;
			var size = stardustLabelTexture.getSize();
			console.log("texture size is"  + JSON.stringify(size)) ;
			stardustNamePlaneLabel.material= dynamicMaterialStardust;
			
			context.fillStyle = "#fff";
			context.fillRect(0, 0,size.width, size.height);
			
			
			context.font = "60px arial";
		
			context.fillStyle = "#555";
			context.fillText(text, size.width/2 - context.measureText(text).width/2, size.height/2);
			
			stardustNamePlaneLabel.parent=mainSphere;
			stardustLabelTexture.update(true);
			
        } else {
			//Make bots
            botSphere = mainSphere.clone(arrayOfUsers.users[i].nickname);
            botSphere.material = new BABYLON.StandardMaterial("texture-" + arrayOfUsers.users[i].nickname, scene);
			botSphere.material.wireframe = true;
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
//Ajouter CCTV, si on est dans la ligne de mire de la camera, notre identité est envoyée a l'admin, qui n'a plus qu'a nous virer...
//On ne le voit pas directement, nous n'apparaissons juste plus dans la ligne,  
 
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

var up_key_code=87;
var down_key_code=83;
var left_key_code=68;
var right_key_code=65;
//Keydown event, handling dirctions keys separately		
$(document).keydown(function(e) {
	console.log("justpressed a key " + e.keyCode);

    if (!Firstkey && (e.keyCode == up_key_code || e.keyCode == down_key_code)) {
        //set the currentKey to the key that is down
        Firstkey = e.keyCode;
        //execute character movement function charWalk('direction')
		//keys W and S for Up and Down
        switch (e.keyCode) {
            case up_key_code:
                charWalk('up');
                break;
            case down_key_code:
                charWalk('down');
                break;
        }
    }
    //One key at a time...
	//keys A and D for Left and Right
    if (!SecondKey && (e.keyCode == left_key_code || e.keyCode == right_key_code)) {
       // console.log("set sedone key");
        //set the currentKey to the key that is down
        SecondKey = e.keyCode;
        //execute character movement function charWalk('direction')
        switch (e.keyCode) {
            case left_key_code:
                charWalk('right');
                break;
            case right_key_code:
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