var app = require('express')();
var http = require('http').Server(app);
var io = require("socket.io")(http);

var activeUsers=new Array();

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
	
	socket.on("typing", function(msg){	
	var msg=msg + " is typing right now...";
	//console.log(msg+" on the server side");
	 io.emit("typing" , msg);
	});
	
	socket.on("sendPM",function(pm){
		console.log("the PM is " + pm);
		var PM=pm[0]+" is saying " + pm[1];
		 io.emit("sendPM" , pm);
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