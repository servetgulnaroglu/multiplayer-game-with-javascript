var express = require('express');
var path = require('path');
const serverless = require('serverless-http');
var app = express();
/*var pathJoin = path.join(__dirname, process.cwd());
const router = express.Router();
app.use( express.static(pathJoin));
console.log('asdasd    ' + __dirname );
console.log(process.cwd());
router.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
 // res.sendFile('index.html', {root:__dirname});
}) 

app.use('/.netlify/functions/server', router); // server may turn to api 
*/
var server = app.listen(3000);
app.use(express.static('public'));//folder name = public 
//module.exports.handler = serverless(app);
//socket.io
//

var socket = require('socket.io');
var io = socket(server);
//var io = socket.listen(server, { serveClient: false });
io.sockets.on('connection', newConnection);

function newConnection(socket){
  console.log('new connection: ' + socket.id);
  socket.on('frame', getCoordinates);
  function getCoordinates(data){
    socket.broadcast.emit('frame', data);
  }

  socket.on('bullet', sendBullet);

  function sendBullet(i){
    socket.broadcast.emit('bullet', i);
  }

  socket.on('gameOver', (data)=> {
    socket.broadcast.emit('gameOver', data);
  })

  socket.on('chat', (data)=>{
    socket.broadcast.emit('chat', data);
  })
}

