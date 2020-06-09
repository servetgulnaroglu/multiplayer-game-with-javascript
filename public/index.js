var socket; 
var machines = {};
var framePerSecond = 30;
socket = io.connect('https://multiplayer-game-js.herokuapp.com/');
//socket = io.connect('http://localhost:3000/')
var canvas = document.getElementById('canvas');
var canvasContext = canvas.getContext('2d');
var chat = document.getElementById('chat');

chat.addEventListener('keyup', (e)=>{
  socket.emit('chat', e.target.value);
})
socket.on('frame', updateMachines);
socket.on('bullet', updateBullets);
socket.on('chat', (data)=>{
  chat.value = data;
})
var enemyBullets = [];
var machinePng = document.getElementById('image');
var myMachine = new Machine(canvas.width/2, canvas.height/2, 0, 100);
var healthBar = document.getElementById('health');

machines = {
  'myMachine': myMachine
}

var keys = {
  w: false,
  leftArrow: false,
  rigthArrow: false,
  space: false
}

function gameOverText(data){
  }
function updateBullets(i){
  myMachine.bullets.splice(i,1);
}

function updateMachines(data){
  for(var i = 0; i < data.bullets.length; i++){
    var bullet = new Bullet(data.bullets[i].x, data.bullets[i].y, data.bullets[i].radian);
    enemyBullets.push(bullet);
  }
  //enemyBullets = data.bullets;
  machines[data.id] = new Machine(data.x, data.y, data.angle, data.health);
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
  if(myMachine.health >= 0 ){
    socket.emit('frame', myMachine);
  }
  isHit();
  console.log(myMachine.health);
    var keys = Object.keys(machines)
  /*if(keys.length == 1){
    canvasContext.fillStyle = 'black';
    canvasContext.font = '30px Arial';
    canvasContext.fillText('You won', 100, 100);
    return;
  }*/
}
/*


    */
function draw(){
  canvasContext.fillStyle = 'black';
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);
  showEnemyBullets(); 
  showMachines();
  drawHealthBar();  
  enemyBullets = [];   
  console.log(myMachine.health);
  if(myMachine.health <= 0){
    canvasContext.fillStyle = 'white';
    canvasContext.font = '30px Arial';
    canvasContext.fillText('You lost', 100, 100);
    myMachine.x = -100;
    myMachine.y = -100;
  }
  var keys = Object.keys(machines);
  var isWon = true;
  for(var i = 1; i < keys.length; i++){
    if(machines[keys[i]].x < 0){
      isWon = true;
    }
    else{
      isWon = false;
      break;
    }
  }
  if(isWon){
    canvasContext.fillStyle = 'white';
    canvasContext.font = '30px Arial';
    canvasContext.fillText('You won', 100, 100);
  }
}



function drawHealthBar(){
  var keys = Object.keys(machines)
    for(var i = 1; i < keys.length; i++){ 
      var oldElement = document.querySelector(`#${keys[i]}`);
      var hbar = oldElement || document.createElement('progress');
      hbar.value = machines[keys[i]].health;
      hbar.max = 100;
      hbar.id = keys[i];
      hbar.className = 'enemyHealthBar';
      hbar.style.top = `${machines[keys[i]].y + 45}px`;
      hbar.style.left = `${machines[keys[i]].x + 10}px`;
      document.body.appendChild(hbar);
        
}}
function isHit(){
  for(var i = 0; i < enemyBullets.length; i++){
    var bullet = enemyBullets[i];
    if((bullet.x > myMachine.x && bullet.x < myMachine.x + myMachine.size - bullet.size) && (bullet.y > myMachine.y && bullet.y < myMachine.y + myMachine.size - bullet.size)){
      myMachine.getDamage();
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
  var keys = Object.keys(machines)
  for(var i = 0; i < keys.length; i++){
    machines[keys[i]].show();
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

