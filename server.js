var express = require('express');
var path = require('path');
const serverless = require('serverless-http');
var app = express();
const port = process.env.PORT || 3000
var server = app.listen(port);
app.use(express.static('public'));//folder name = public 
var socket = require('socket.io');
var io = socket(server);
io.sockets.on('connection', newConnection);
function newConnection(socket){
  console.log('new connection: ' + socket.id);
  socket.on('frame', getCoordinates);
  function getCoordinates(data){
    data.id = socket.id;
    socket.broadcast.emit('frame', data);
  }

  socket.on('bullet', sendBullet);

  function sendBullet(i){
    socket.broadcast.emit('bullet', i);
  }

  socket.on('chat', (data)=>{
    socket.broadcast.emit('chat', data);
  })
}

