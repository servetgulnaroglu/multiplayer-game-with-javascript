var socket; 
var machines = {};
var framePerSecond = 45;
socket = io.connect('https://multiplayer-game-js.herokuapp.com/');
//socket = io.connect('http://localhost:3000/')
var myID;
socket.on('getID', (id)=>{
  myID = id;
})
var players = document.getElementById('players');
var maxCanvasWidth = 1920;
var maxCanvasHeight = 1080;
var button;
var playerCount;
var reference = {
  x: 0,
  y: 0
}
var keyButton = document.getElementById('keyButton');
var keyCard = document.getElementById('keys');
keyButton.onclick = function(){
  keyCard.style.visibility = keyCard.style.visibility == 'visible'? 'hidden': 'visible';
}
var myMoney = 0;
var leaderList = document.getElementById('leaderList')
var canvas = document.getElementById('canvas');
var cost = 20;
var chatInput = document.getElementById('chatInput');
var chatList = document.getElementById('chatList');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener("resize", ()=>{
  if(gameState != gameStates.ENTER_MENU){
    var oldWidth = canvas.width;
    var oldHeight = canvas.height;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvasContext.translate(canvas.width / 2 - myMachine.x, canvas.height / 2 - myMachine.y);
  }
});
var canvasContext = canvas.getContext('2d');
var allBullets = [];
var myMachine;
var playerName;
var gameStates = {
  ENTER_MENU : 0,
  GAME : 1,
  GAME_OVER_MENU: 2
}
var gameState = gameStates.ENTER_MENU;
var loop;
socket.on('playerCount', (count) => {
    players.textContent = 'Players: ' + (count);
})
socket.on('frame', (data) => {
  machines = data;
  var keys = Object.keys(data);
});

socket.on('bullet', (bullet) =>{
  allBullets.push(new Bullet(bullet.x, bullet.y, bullet.radian, bullet.range));
})

socket.on('message', (message) => {
  var el = document.createElement('li');
  el.textContent = message;
  el.style.color = 'rgba(255,122,130,1)';
  chatList.appendChild(el);
  chatList.scrollTop = chatList.scrollHeight;
})
  
socket.on('sortedPlayers', (sortedPlayers)=>{
  leaderList.innerHTML = '';
  for(var i = 0; i < sortedPlayers.length; i++){
    if(sortedPlayers[i].name != 'inLobby'){
      var li = document.createElement('li');
      li.innerHTML = sortedPlayers[i].name + '<br>' + sortedPlayers[i].score;
      leaderList.appendChild(li);
    }  
  }
})
var machinePng = document.getElementById('image');
var healthBar = document.getElementById('health');
var keys = {
  w: false,
  leftArrow: false,
  rigthArrow: false,
  downArrow: false,
  space: false,
  one: false,
  two: false,
  enter : false
}

window.onload = ()=>{
  loop = setInterval(show, 1000/framePerSecond);
}

if(gameState == gameStates.ENTER_MENU){
  canvasContext.fillStyle = 'rgba(0,0,0,0.5)';
  canvasContext.fillRect(canvas.width/4, canvas.height/4, canvas.width/2, canvas.height/2);
  canvasContext.fillStyle = 'white';
  canvasContext.font = '20px Arial';
  canvasContext.textAlign = 'center';
  canvasContext.fillText("Enter Name",canvas.width/2, canvas.height/2 - 50);
  var input = document.createElement('input');
  input.type = 'text';
  input.id = 'name';
  input.style.position = 'absolute';
  input.style.margin = 'auto';
  input.style.width = '100px';
  input.setAttribute('maxlength', 13);
  input.style.top = `${canvas.height / 2}px`;
  input.style.left = `${canvas.width / 2 - 50}px`;
  input.autofocus = true;
  document.body.appendChild(input);
  var button = document.createElement('input');
  button.type = 'button';
  button.value = 'START';
  button.id = 'button';
  button.style.position = 'absolute';
  button.style.width = '80px';
  button.style.top = `${canvas.height / 2 + 50}px`;
  button.style.left = `${canvas.width / 2 - 40}px`;
  button.onclick = () =>{
    playerName = input.value;
    myMachine = new Machine( Math.random() * (maxCanvasWidth - 50) , Math.random() * (maxCanvasHeight - 50), 0, 100,playerName ,[]);
    gameState = gameStates.GAME;
    var el = document.getElementById('name');
    el.parentNode.removeChild(el);
    el = document.getElementById('button');
    el.parentNode.removeChild(el);
  }
  document.body.appendChild(button); 
}

function show(){
  if(gameState == gameStates.GAME || gameState == gameStates.GAME_OVER_MENU) {
    update();
    draw();
  } 
}

function update(){
  canvasContext.clearRect(-1000, -1000, maxCanvasWidth + 2000, maxCanvasHeight + 2000);
  checkKeys(); 
  if(myMachine.health >= 0 ){
    socket.emit('frame', myMachine);
  }
  canvasContext.translate(-(myMachine.x - canvas.width / 2 + reference.x),-( myMachine.y - canvas.height / 2 + reference.y));
  reference.x += -(myMachine.x - canvas.width / 2 + reference.x);
  reference.y += -(myMachine.y - canvas.height / 2 + reference.y);  
  
}

function draw(){
  canvasContext.fillStyle = 'black';
  canvasContext.fillRect(-1000, -1000, maxCanvasWidth + 2000, maxCanvasHeight + 2000);
  canvasContext.beginPath();
  canvasContext.strokeStyle = 'white';
  canvasContext.rect(0, 0, maxCanvasWidth, maxCanvasHeight);
  canvasContext.stroke();
  canvasContext.closePath();
  showMachines();
  canvasContext.textAlign = 'start';
  showScore();
  showLeaderBord();
  showRange();
  showBulletCount();
  showMoney();
  animateMoney();
  if(myMachine.health <= 0){
    clearInterval(loop);
    gameState = gameStates.GAME_OVER_MENU;
    socket.disconnect();
    gameOver();
  }
}

function showMachines(){
  var keys = Object.keys(machines)
  var machine;
  
   for(var i = 0; i < allBullets.length; i++){ 
    var is = false;
    for(var j = 0; j < myMachine.bullets.length; j++){
      if(allBullets[i].x == myMachine.bullets[j].x && allBullets[i].y == myMachine.bullets[j].y){
        is = true;
      }
    }
    if(is){
      continue;
    }
    else if(allBullets[i].x > myMachine.x   && allBullets[i].x < myMachine.x +  myMachine.size   &&
      allBullets[i].y > myMachine.y   && allBullets[i].y < myMachine.y + myMachine.size  
      ){
      myMachine.getDamage();
      allBullets.splice(i, 1);
      i--;
    }
  }
  for(var i = 0; i < myMachine.bullets.length; i++){
    myMachine.bullets[i].show();
  }
  for(var i = 0; i < allBullets.length; i++){
    if(allBullets[i].range - 25 < Math.sqrt(Math.pow(allBullets[i].x - allBullets[i].startX, 2) + Math.pow(allBullets[i].y - allBullets[i].startY, 2))){
      allBullets.splice(i, 1);
      i--;
    }
  }
  for(var i = 0; i < keys.length; i++){
    for(var j = 0; j < myMachine.bullets.length; j++){
      if(keys[i] != myID && myMachine.bullets[j].x > machines[keys[i]].machine.x &&
        myMachine.bullets[j].x < machines[keys[i]].machine.x + myMachine.size - myMachine.bullets[j].size &&
        myMachine.bullets[j].y > machines[keys[i]].machine.y && 
        myMachine.bullets[j].y < machines[keys[i]].machine.y + myMachine.size - myMachine.bullets[j].size
      ){
        myMachine.bullets.splice(j, 1);
        myMachine.score += 3;
        myMoney += 3;
        j--;
      }
    }
  }

  for(var i = 0; i < allBullets.length; i++){
    allBullets[i].show();
  }

  myMachine.update();
  myMachine.call();
  for(var i =0; i < myMachine.bullets.length; i++){
    myMachine.bullets[i].draw();
  }
  for(var i = 0; i < keys.length; i++){ 
    if(myID != keys[i] && machines[keys[i]].machine.health > 0){
      machine = new Machine(machines[keys[i]].machine.x, machines[keys[i]].machine.y, machines[keys[i]].machine.angle, machines[keys[i]].machine.health, machines[keys[i]].machine.playerName, machines[keys[i]].machine.bullets);
      machine.call(); 
    }
  }
  myMachine.showRange();
}

function gameOver(){
  myMoney = 0; 
  cost = 20;
  var x = reference.x + myMachine.x;
  var y = reference.y + myMachine.y;
  canvasContext.fillStyle = 'rgba(0,0,0,0.5)';
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);
  canvasContext.fillStyle = 'white';
  canvasContext.font = '20px Arial';
  canvasContext.textAlign = 'start';
  canvasContext.fillText("You Lost", x - reference.x, y - reference.y - 50);
  canvasContext.fillStyle = 'white';
  canvasContext.fillText('Score: ' + myMachine.score, x - reference.x , y -reference.y - 25);
  myMachine.x = -myMachine.range - myMachine.size - 10;
  var input = document.getElementById('name') || document.createElement('input');
  input.type = 'text';
  input.id = 'name';
  input.value = playerName;
  input.style.position = 'absolute';
  input.style.margin = 'auto';
  input.style.width = '100px';
  input.setAttribute('maxlength', 13);
  input.style.top = `${y}px`;
  input.style.left = `${x}px`;
  document.body.appendChild(input);
  button = document.getElementById('button') || document.createElement('input');
  button.type = 'button';
  button.value = 'START';
  button.id = 'button';
  button.style.position = 'absolute';
  button.style.width = '80px';
  button.style.top = `${y + 25}px`;
  button.style.left = `${x}px`;
  button.autofocus = true;
  button.onclick = () =>{
    playerName = input.value;
    myMachine = new Machine(Math.random() * (maxCanvasWidth - 50) , Math.random() * (maxCanvasHeight - 50), 0, 100,playerName ,[]);
    gameState = gameStates.GAME;
    var el = document.getElementById('name');
    el.parentNode.removeChild(el);
    el = document.getElementById('button');
    el.parentNode.removeChild(el);
    loop = setInterval(show, 1000/framePerSecond);
    socket.connect();
  }
  document.body.appendChild(button); 
}

function showScore(){
  canvasContext.fillStyle = 'white';
  canvasContext.font = '30px sans-serif';
  canvasContext.fillText('Score: ' + myMachine.score, -reference.x + 10 , - reference.y + 25 );
}

function showRange(){
  canvasContext.fillStyle = 'white';
  canvasContext.font = '30px sans-serif';
  canvasContext.fillText('Range: ' + myMachine.range, - reference.x + 10, - reference.y + 60);
}

function showBulletCount(){
  canvasContext.fillStyle = 'white';
  canvasContext.font = '30px sans-serif';
  canvasContext.fillText('Bullet: ' +  ( myMachine.maxBulletCount - myMachine.bullets.length) + ' / ' + myMachine.maxBulletCount, -reference.x + 10,- reference.y + 95);
}

function showLeaderBord(){
}

function showMoney(){
  canvasContext.fillStyle = 'white';
  canvasContext.font = '30px sans-serif';
  canvasContext.fillText('Money: ' + myMoney, -reference.x + 10,- reference.y + 130); 
}

function animateMoney(){
  canvasContext.fillStyle = 'white';
  canvasContext.fillRect(-reference.x + 10, -reference.y + 150, 100, 5)
  canvasContext.fillStyle = 'green';
  canvasContext.fillRect(-reference.x + 10, -reference.y + 150, myMoney <= cost? myMoney * cost*  (100 / cost)/ cost : 100, 5)
  if(myMoney >= cost){
    canvasContext.fillStyle = 'green';
    var xpos = 200;
    canvasContext.font = '15px sans-serif';
    canvasContext.fillRect(- reference.x + 10 + xpos, - reference.y + 60 - 20, 170, 20 );
    canvasContext.fillStyle = 'white';
    canvasContext.fillText('to upgrade press 1 (+10)', - reference.x + 10 + xpos + 5, - reference.y + 60 + 5 - 10);
    canvasContext.fillStyle = 'green';
    canvasContext.fillRect(- reference.x + 10 + xpos, - reference.y + 95 - 20, 170, 20 );
    canvasContext.fillStyle = 'white';
    canvasContext.fillText('to upgrade press 2 (+1)', - reference.x + 10 + xpos + 5, - reference.y + 95 + 5 - 10);
  }
}

function sendMessage(){
  var input = chatInput.value;
  var message = playerName + ': ' + input;
  var el = document.createElement('li');
  el.textContent = message;
  el.style.color = 'rgba(157,251,255,0.8)';
  chatList.appendChild(el);
  chatList.scrollTop = chatList.scrollHeight;
  chatInput.value = '';
  socket.emit('message', message);
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
  } else if (e.keyCode == 49){
    keys['one'] = true;
  } else if (e.keyCode == 50){
    keys['two'] = true;
  } else if (e.keyCode == 13){
    keys['enter'] = true;
  } else if (e.keyCode == 40){
    keys['downArrow'] = true;
  }
})

window.addEventListener('scroll', ()=>{
  window.scrollTo(0, 0);
});

window.addEventListener('keyup', e => {
  /*if(e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 37 || e.keyCode == 32)
    // e.preventDefault();*/
  if(e.keyCode == 38){
    keys['w'] = false;
  } else if (e.keyCode == 39){
    keys['rightArrow'] = false;
  } else if (e.keyCode == 37){
    keys['leftArrow'] = false;
  } else if (e.keyCode == 32){
    keys['space'] = false;
  } else if (e.keyCode == 49){
    keys['one'] = false;
  } else if (e.keyCode == 50){
    keys['two'] = false;
  } else if (e.keyCode == 13){
    keys['enter'] = false;
  } else if (e.keyCode == 40){
    keys['downArrow'] = false;
  }
})

window.addEventListener('keydown', e => {
  if(e.keyCode == 13 && (gameState == gameStates.ENTER_MENU || gameState == gameStates.GAME_OVER_MENU)) {
    button.click();
  }
})


function checkKeys(){
  if(keys.w)
    myMachine.moveTop();
  if(keys.rightArrow)
    myMachine.turnRight();
  if(keys.leftArrow)
    myMachine.turnLeft();
  if(keys.space){
    if(myMachine.fire()){
      socket.emit('bullet', {x: myMachine.headX, y: myMachine.headY, radian: myMachine.radian, range:myMachine.range});
    }
  }
  if(keys.one && myMoney >= cost){
    keys['one'] = false;
    myMachine.increaseRange();
    myMoney -= cost;
    cost += 10;
  }
  if(keys.two && myMoney >= cost){
    keys['two'] = false;
    myMachine.increaseBulletCount();
    myMoney -= cost;
    cost += 10;
  }
  if(keys.enter && chatInput.value != ''){
    sendMessage();
    keys['enter'] = false;
  }
  
  if(keys.downArrow){
    myMachine.moveBack();
  }
}

