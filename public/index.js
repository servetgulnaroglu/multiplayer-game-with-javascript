var socket; 
var machines = [];
var framePerSecond = 30;
socket = io.connect('https://machine-game.netlify.app/');
var canvas = document.getElementById('canvas');
var canvasContext = canvas.getContext('2d');
var gameOver = 0;
var chat = document.getElementById('chat');

chat.addEventListener('keyup', (e)=>{
  socket.emit('chat', e.target.value);
})
socket.on('frame', updateMachines);
socket.on('bullet', updateBullets);
socket.on('gameOver', (data)=>{
  gameOver = 1;
});
socket.on('chat', (data)=>{
  chat.value = data;
})
var enemyBullets = [];
var machinePng = document.getElementById('image');
var myMachine = new Machine();
var healthBar = document.getElementById('health');

var keys = {
  w: false,
  leftArrow: false,
  rigthArrow: false,
  space: false
}
machines.push(myMachine);

function gameOverText(data){
  }
function updateBullets(i){
  myMachine.bullets.splice(i,1);
}

function updateMachines(data){
  var newMachine = new Machine();
  newMachine.x = data.x;
  newMachine.y = data.y;
  newMachine.angle = data.angle;
  newMachine.health = data.health;
  for(var i = 0; i < data.bullets.length; i++){
    var bullet = new Bullet(data.bullets[i].x, data.bullets[i].y, data.bullets[i].radian);
    enemyBullets.push(bullet);

  }
  //enemyBullets = data.bullets;
  machines[1] = newMachine;
}
window.onload = ()=>{
  setInterval(show, 1000/framePerSecond);
}

function show(){
  update();
  draw();
}

function updateHealthBar(){
  healthBar.value = myMachine.health;  
}

function update(){
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  checkKeys(); 
  socket.emit('frame', myMachine);
  isHit();
}

function draw(){
  if(gameOver == 1){
    canvasContext.fillStyle = 'black';
    canvasContext.font = '30px Arial';
    canvasContext.fillText('You won', 100, 100);
    return;
  }
  else if (gameOver == -1){
    canvasContext.fillStyle = 'black';
    canvasContext.font = '30px Arial';
    canvasContext.fillText('You lost', 100, 100);
    return;
  }
  canvasContext.fillStyle = 'black';
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);
  showEnemyBullets(); 
  showMachines();
  drawHealthBar();
  

  enemyBullets = [];
}

var hbar = document.createElement('progress');
function drawHealthBar(){
  if(machines.length == 2){
  hbar.value = machines[1].health;
  hbar.max = 100;
  hbar.className = 'enemyHealthBar';
  hbar.style.top = `${machines[1].y + 45}px`;
  hbar.style.left = `${machines[1].x + 10}px`;
  document.body.appendChild(hbar);
}}
function isHit(){
  for(var i = 0; i < enemyBullets.length; i++){
    var bullet = enemyBullets[i];
    if((bullet.x > myMachine.x && bullet.x < myMachine.x + myMachine.size - bullet.size) && (bullet.y > myMachine.y && bullet.y < myMachine.y + myMachine.size - bullet.size)){
      myMachine.getDamage();
      if(myMachine.health == 0 ){
        gameOver = -1;
        socket.emit('gameOver', 1);
      }
      updateHealthBar();
      socket.emit('bullet', i);
    }
  }
}
function showEnemyBullets(){
  for(var i = 0; i < enemyBullets.length; i++){
    var bullet = enemyBullets[i];
    if(bullet.x > canvas.width - bullet.size|| bullet.x < - bullet.size||
      bullet.y > canvas.height - bullet.size|| bullet.y < - bullet.size){
      enemyBullets.splice(i,1);
    }
  }
  for(var i = 0; i < enemyBullets.length; i++){
    enemyBullets[i].move();
    enemyBullets[i].draw();
  }
}

function showMachines(){
  for(var i = 0; i < machines.length; i++){
    machines[i].show();
  }
}
window.addEventListener('keydown', e => {
  if(e.keyCode == 38){
    keys['w'] = true;
  } else if (e.keyCode == 39){
    keys['rightArrow'] = true;
  } else if (e.keyCode == 37){
    keys['leftArrow'] = true;
  } else if (e.keyCode == 32){
    keys['space'] = true;
  }
})

window.addEventListener('keyup', e => {
  if(e.keyCode == 38){
    keys['w'] = false;
  } else if (e.keyCode == 39){
    keys['rightArrow'] = false;
  } else if (e.keyCode == 37){
    keys['leftArrow'] = false;
  } else if (e.keyCode == 32){
    keys['space'] = false;
  }
})

function checkKeys(){
  if(keys.w)
    myMachine.moveTop();
  if(keys.rightArrow)
    myMachine.turnRight();
  if(keys.leftArrow)
    myMachine.turnLeft();
  if(keys.space)
    myMachine.fire();
}

