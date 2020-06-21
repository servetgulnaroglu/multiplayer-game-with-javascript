var express = require('express');
var path = require('path');
const serverless = require('serverless-http');
var app = express();
//const port = process.env.PORT || 3000
//var server = app.listen(port);
var server = app.listen(3000);
app.use(express.static('public'));//folder name = public 
var socket = require('socket.io');
var io = socket(server);
var machines = {};
var bullets = [];
var playerCount = 0; 
var loop;
io.sockets.on('connection', newConnection);
function newConnection(socket){
  playerCount++;
  console.log('new connection: ' + socket.id);
  io.to(socket.id).emit('getID', socket.id);
  io.emit('playerCount', playerCount);
  machines[socket.id] = {
    machine: {
      playerName: 'inLobby',
      x: -1200,
      y: 0,
      angle: 0,
      speed: 4,
      size: 32,
      radian: 0, 
      headX: 0,
      headX: 0, 
      bullets: [],
      health: 100
    }
  };
  
  var sendLoop = setInterval(function(){
    var keys = Object.keys(machines);
    var playerOrder = [];
    for(var i = 0; i < keys.length; i++){
      playerOrder.push({name: machines[keys[i]].machine.playerName, score: machines[keys[i]].machine.score});
    }
    playerOrder.sort(function(a,b){return b.score - a.score});
    if(playerOrder.length > 5){
      playerOrder.splice(5, playerOrder.length);
    }
    io.emit('sortedPlayers', playerOrder);
  }, 1000);
  socket.on('frame', (data) => {
    machines[socket.id] = {
      machine: data
    };
    io.emit('frame', machines);
  });

  socket.on('bullet', (bullet)=>{
    socket.broadcast.emit('bullet', bullet);
  })
  socket.on('message', (message) => {
    socket.broadcast.emit('message', message);
  })
  socket.on('disconnect', (data) => {
    console.log('connection lost: ' + socket.id);
    console.log('deleted' + machines.id);
    playerCount--;
    io.emit('playerCount', playerCount);
    delete machines[socket.id];
  })   
}
