var express = require('express');
var path = require('path');
const serverless = require('serverless-http');
var app = express();
const port = process.env.PORT || 3000
var server = app.listen(port);
//var server = app.listen(3000);
app.use(express.static('public'));//folder name = public 
var socket = require('socket.io');
var io = socket(server);
var machines = {};
var bullets = [];
io.sockets.on('connection', newConnection);

function newConnection(socket){
  console.log('new connection: ' + socket.id);
  io.to(socket.id).emit('getID', socket.id);
  machines[socket.id] = {
    machine: {
      playerName: 'inLobby',
      x: -100,
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
    delete machines[socket.id];
  })
}
