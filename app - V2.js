var app = require('express')();
var http = require('http').Server(app);
var io = require("socket.io")(http);

var activeUsers=new Array();
var usersObject={users:[]};
var destinationSocketId;


app.get('/', function(req, res){
  //res.send('<h1>Hello world</h1>');
  res.sendFile(__dirname + '/index.html');
  //res.sendFile('/index.html');
});

app.get('/shadow', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.end('<b>you are in the shadow ! mouhahahahahaha</b>');
});

io.on('connection' , function(socket){
 console.log("add a new USER to the array...");
//send a message to everyone

	socket.on('newuser', function(nickname){
	activeUsers.push(nickname);
	console.log(nickname+" just connected WITH THE ID " + socket.id);
	io.emit("newuser", nickname);
	io.emit("update-users", activeUsers);
	
	console.log("length of the object is " + usersObject.users.length);
	 usersObject.users[usersObject.users.length]={nickname:nickname, socketId:socket.id};
	 
	 	console.log("length of the object is now" + usersObject.users.length);
		console.log("first nick is  " + usersObject.users[0].nickname);
		console.log("first ID is  " + usersObject.users[0].socketId);
	});
	
	socket.on('disconnect', function(info){
	console.log(info + ' disconnected');
	//io.emit("disconnect", nickname + " disconnected");
	});
 	
	socket.on('user-gone', function(nick){
	
	
	console.log(nick + ' disconnected');
	io.emit("user-gone", nick);
	
	//remove user
	var indexToRemove = activeUsers.indexOf(nick);
	if (indexToRemove > -1) {
		activeUsers.splice(indexToRemove, 1);
	}
	io.emit("update-users", activeUsers);
	
	});
	
	
	/*
	fonction pour trouver valeur dans objet
	
	function findWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
        }
		}
	}
	
	*/
	
	socket.on("typing", function(msg){	
	var msg=msg + " is typing right now...";
	//console.log(msg+" on the server side");
	 io.emit("typing" , msg);
	});
	
	
	
	//When A Private message is sent from a client
	socket.on("sendPM",function(pm){
		console.log("the PM is " + pm);
		var PM_dest=pm[0]+" is saying " + pm[1] ;
		
		for(var j=0 ; j<=usersObject.users.length-1 ; j++){
			if(usersObject.users[j].nickname==pm[2] ){
				destinationSocketId= usersObject.users[j].socketId;
			}
			//console.log("the user is " + usersObject.users[j].nickname+ " had the id " + usersObject.users[j].socketId);
			
		}
		
		//Find socket id of destination
		io.to(destinationSocketId).emit('sendPM', PM_dest);
	});
	 
	
	socket.on('chat message', function(msg){
	console.log( msg[1] +  ' saying ' + msg[0]);
	//send a message to everyone
	io.emit('chat message',msg);
	});
	
	
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});