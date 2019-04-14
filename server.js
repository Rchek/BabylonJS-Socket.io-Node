var express = require('express'); // Get the module
//var app = require('express')();
var app = express();
var http = require('http').Server(app);
//var http = require('http');
var io = require("socket.io")(http);
//rien en fait...
var usersObject={users:[]};
var destinationSocketId;
var networkPrefix="172.16.";
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1" ;
var port      = process.env.OPENSHIFT_INTERNAL_PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
http.listen(port, ipaddress, function(){
	console.log('listening on *:' + port + ", " + ipaddress);
});
 
//This Object contains the different events and actions possibles for each type of device
var devicesEventsActions={
camera:[{ events:["crashed","doNothing","doNothing","doNothing","fullDrive","doNothing","doNothing","doNothing","ipLost","doNothing"], expectedActions:["reboot","nothing","nothing","nothing","changeDrive","nothing","nothing","nothing","requestNewIp","nothing"] }, {actions:["resumeRecording","reboot","changeDrive","requestNewIp"]}],
phones:[{ events:["incomingCall","doNothing","doNothing","doNothing","crashed","doNothing","ipLost","doNothing"] , expectedActions:["transfertCall","nothing","nothing","nothing","reboot","nothing","requestNewIp","nothing"]}, {actions:["transfertCall", "reboot","requestNewIp"]}],
printers:[{ events:["outOfPaper","doNothing","outOfInk","doNothing","doNothing","crashed","doNothing","ipLost","doNothing"] , expectedActions:["addPaper","nothing","replaceInk","nothing","nothing","reboot","nothing","requestNewIp","nothing"]}, {actions:["addPaper", "replaceInk", "reboot","requestNewIp"]}]
};
 
setInterval(pickEvent, 5000);
var keysOfDevices = Object.keys(devicesEventsActions);

var stocks={
itemA:"250",
itemB:"250",
itemC:"250",
itemD:"250"
};

//Pick a randon event on a random device, and then pick an Ip among those available for the picked device...
function pickEvent(){
	//Choose random number for the devide...
	var deviceRandom=Math.round(Math.random()*(keysOfDevices.length-1));
	var pickedDevice= keysOfDevices[deviceRandom];
	var actionRandom=Math.round(Math.random()* (devicesEventsActions[keysOfDevices[deviceRandom]][0].events.length -1));
	var pickedEvent=devicesEventsActions[keysOfDevices[deviceRandom]][0].events[actionRandom]  ;
	//ensuite selectionner appareil...
	var randomIpIndex=Math.round( Math.random()*(tableIps[keysOfDevices[deviceRandom]].length -1));
	pickedIp=tableIps[keysOfDevices[deviceRandom]][randomIpIndex].adress;
	var expectedAction=devicesEventsActions[pickedDevice][0].expectedActions[actionRandom];
	
	var possibleActions=devicesEventsActions[pickedDevice][1].actions;
	var pickedObj=[pickedDevice, pickedIp ,pickedEvent , possibleActions,expectedAction];
	//I send the network-update event...
	 if(pickedEvent!="doNothing"){
		io.emit("network-update", pickedObj);
	}	
}	
//Ip adresses...
var tableIps={
computers:[
//Subnet 1
{adress:"172.16.1.1", used:"no", hostname:"", mask:"255.255.255.0" , charname:"charac-one",  colorR:0.9, colorV:0.2, colorB:0.4, xBabylon:0, yBabylon:0,yBabylonRotation:0},
{adress:"172.16.1.2", used:"no", hostname:"", mask:"255.255.255.0" ,charname:"charac-two", colorR:0.8, colorV:0.5, colorB:0.2, xBabylon:0, yBabylon:0,yBabylonRotation:0},
{adress:"172.16.1.3", used:"no", hostname:"", mask:"255.255.255.0" ,charname:"charac-three", colorR:0.2, colorV:0.2, colorB:0.4,xBabylon:0, yBabylon:0,yBabylonRotation:0},
{adress:"172.16.1.4", used:"no", hostname:"", mask:"255.255.255.0" ,charname:"charac-four", colorR:0.4, colorV:0.2, colorB:0.4,xBabylon:0, yBabylon:0 ,yBabylonRotation:0}, 
{adress:"172.16.1.5", used:"no", hostname:"", mask:"255.255.255.0" ,charname:"charac-five", colorR:0.4, colorV:0.2, colorB:0.4,xBabylon:0, yBabylon:0,yBabylonRotation:0 },
//Subnet 2
{adress:"172.16.2.1", used:"no", hostname:"", mask:"255.255.255.0" , charname:"charac-one", xBabylon:0, yBabylon:0},
{adress:"172.16.2.2", used:"no", hostname:"", mask:"255.255.255.0" , charname:"charac-one", xBabylon:0, yBabylon:0},
{adress:"172.16.2.3", used:"no", hostname:"", mask:"255.255.255.0" , charname:"charac-one", xBabylon:0, yBabylon:0},
{adress:"172.16.2.4", used:"no", hostname:"", mask:"255.255.255.0" , charname:"charac-one", xBabylon:0, yBabylon:0}, 
{adress:"172.16.2.5", used:"no", hostname:"", mask:"255.255.255.0" , charname:"charac-one", xBabylon:0, yBabylon:0}
],
camera:[
{adress:"172.16.1.6", used:"yes", hostname:"cam-one-six", mask:"255.255.255.0" },
{adress:"172.16.2.6", used:"yes", hostname:"cam-two-six", mask:"255.255.255.0" },
{adress:"172.16.3.6", used:"yes", hostname:"cam-three-six", mask:"255.255.255.0" },
{adress:"172.16.4.6", used:"yes", hostname:"cam-four-six", mask:"255.255.255.0" },
],
printers:[
{adress:"172.16.1.10", used:"yes", hostname:"print-one", mask:"255.255.255.0" },
{adress:"172.16.2.10", used:"yes", hostname:"print-two", mask:"255.255.255.0" },
{adress:"172.16.3.10", used:"yes", hostname:"print-three", mask:"255.255.255.0" },
{adress:"172.16.4.10", used:"yes", hostname:"print-four", mask:"255.255.255.0" },
],
phones:[
{adress:"172.16.1.11", used:"yes", hostname:"phone-one-one", mask:"255.255.255.0" },
{adress:"172.16.2.11", used:"yes", hostname:"print-two-one", mask:"255.255.255.0" },
{adress:"172.16.3.11", used:"yes", hostname:"print-three-one", mask:"255.255.255.0" },
{adress:"172.16.4.11", used:"yes", hostname:"print-four-one", mask:"255.255.255.0" },
],
};
//DO A DHCP server that mentions all the avilable IPS... Or just static ?
/*
The way it works is that is goes through the computers, and takes the first one that is not used... then we "break" the loop to get out of it...
*/
//Mention location of static files
app.use(express.static(__dirname + '/public'));

app.get('/arena', function(req, res){
  res.sendFile(__dirname + '/arena.html');
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/home.html');
});

app.get('/office', function(req, res){
  //res.send('<h1>Hello world</h1>');
  //console.log("has it reached GET");
  res.sendFile(__dirname + '/office.html');
  //res.sendFile('/index.html');
});

app.get('/rooms', function(req, res) {
    //res.setHeader('Content-Type', 'text/html');
    //res.setHeader('Content-Type', 'text/plain');
    //res.end('Here I get the rooms ');
	res.sendFile(__dirname + '/rooms.html');
});

app.get('/babylon', function(req, res) {
	res.sendFile(__dirname + '/babylon.html');
});

app.get('/warehouse', function(req, res) {
	res.sendFile(__dirname + '/warehouse.html');
});
app.get('/customer', function(req, res) {
	res.sendFile(__dirname + '/customer.html');
});

io.on('connection' , function(socket){

	io.emit("loadModel", "mess");
	//send a message to everyone
	socket.on('newuser', function(nickname){
	console.log("new user -----");
	nicknameValid=true;
	//je parcours le tableau un première fois pour voir si le nickname n'est pas déjà pris...
	for(var b=0 ; b<=usersObject.users.length-1;b++){
			if(usersObject.users[b].nickname==nickname){
				//console.log("nickname already taken");
				
				//If it's already taken, instead of refusing, the user could be allowed to control the user in the arena or the chat
				nicknameValid=false;
			}
	}	
	if(nicknameValid){
		//Je parcours la table d'ip, et j'assigne la première disponible 
		for(var k=0 ; k<=tableIps.computers.length-1;k++){
			if(tableIps.computers[k].used=="no"){
			var ipToAssign =  tableIps.computers[k].adress ;
				tableIps.computers[k].used="yes";
				tableIps.computers[k].hostname=nickname;
				var charName=  tableIps.computers[k].charname;
				var babylonColorR = tableIps.computers[k].colorR;
				var babylonColorV = tableIps.computers[k].colorV;
				var babylonColorB = tableIps.computers[k].colorB;
				break;
			}
		}
	}
	if(ipToAssign && nicknameValid){
			//host prefix
			//Assign Ip adress, Nickname, and SocketId
			usersObject.users[usersObject.users.length]={nickname:nickname, socketId:socket.id , ipadress:ipToAssign , subnetNumber:ipToAssign.slice(7, 8) , hostNumber:ipToAssign.slice(-1) , xPosition:190 , yPosition:210, charName:charName, orientation:"stand" , colorR:babylonColorR, colorV:babylonColorV, colorB:babylonColorB , xBabylon:0, zBabylon:0, yBabylon:0,yBabylonRotation:0};	
			io.emit("newuser", nickname);
			io.emit("update-users" , usersObject);
		}
		else{
			var errorObj={userData:[{nickname:nickname, socketId:socket.id}]};
			errorObj.userData[0].message=(!nicknameValid) ? "Sorry, nickname already taken":"Sorry, the room is full (no more ip available)";
			io.to( socket.id).emit('roomError', errorObj);
		}
	});
	
	socket.on('disconnect', function(info){
	//io.emit("disconnect", nickname + " disconnected");
	});
	socket.on('roomRequest', function(){
			io.to( socket.id).emit("update-users" , usersObject);
	});
	
	
	socket.on('user-gone', function(goneObj){	
	
	io.emit("user-gone", goneObj.nickname);	
	//Remove nickname from the users, but only if it has a scket id...
	for (var z=0;z<=usersObject.users.length-1;z++){
			if(usersObject.users[z].socketId==goneObj.socketId ){
				console.log("I must remove index for the socket " + goneObj.socketId );
				//delete usersObject.users[z];		
				usersObject.users.splice(z, 1);
				//And if it was fgound, it means it had an Ip adress
				//Update Ip tables status
				for (var y=0;y<=tableIps.computers.length-1;y++){
						if(tableIps.computers[y].hostname==goneObj.nickname){
							//console.log("I must free the adress" + tableIps.computers[y].adress);
							tableIps.computers[y].hostname="";
							tableIps.computers[y].used="no";
							break;
						}
				}
			}
	}
 
	//update users, so I can remove the one who disconnected
	io.emit("update-users" , usersObject);
	}); 
	socket.on("typing", function(msg){	
		var msg=msg + " is typing right now...";
		//console.log(msg+" on the server side");
		io.emit("typing" , msg);
	});
	//When A Private message is sent from a client
	socket.on("sendPM",function(pm){
		var PM_dest=pm[0]+" ::: " + pm[1] ;
		for(var j=0 ; j<=usersObject.users.length-1 ; j++){
			if(usersObject.users[j].nickname==pm[2] ){
				destinationSocketId= usersObject.users[j].socketId;
			}
		}
		//Find socket id of destination
		io.to(destinationSocketId).emit('sendPM', PM_dest);
	});
	
	socket.on('chat message', function(msg){
	//send a message to everyone
	io.emit('chat message',msg);
	});
	//Send stock level
	io.emit('update-stock',stocks);
	//When a character is moving 
	socket.on("characterMoving", function(obj){
	//je parcours le tableau un première fois pour voir si le nickname n'est pas déjà pris...
	for(var f=0 ; f<=usersObject.users.length-1;f++){
			if(usersObject.users[f].charName==obj.charId){
				console.log("I must update data for " +usersObject.users[f].charName + " who has the id " + obj.charId );
				//Update the data
				usersObject.users[f].xPosition=obj.xPosition;
				usersObject.users[f].yPosition=obj.yPosition;
				usersObject.users[f].orientation=obj.orientation;
			}
	}	
	io.emit("update-positions", usersObject);
	});
	
	//When a babylon sphere is moving
	socket.on("babylonMoving", function(obj){
	//je parcours le tableau un première fois pour voir si le nickname n'est pas déjà pris...
	for(var f=0 ; f<=usersObject.users.length-1;f++){

			 if(usersObject.users[f].nickname==obj.nickname){
				//Update the data
				usersObject.users[f].xBabylon=obj.xBabylon;
				usersObject.users[f].zBabylon=obj.zBabylon;
				usersObject.users[f].yBabylon=obj.yBabylon;
				usersObject.users[f].yBabylonRotation=obj.yBabylonRotation;
			} 
			
			
	}	
	io.emit("update-positions", usersObject);
	});
});
