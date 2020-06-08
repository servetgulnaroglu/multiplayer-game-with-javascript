class Machine{
  constructor(){
    this.x = canvas.width/2;
    this.y = canvas.height/2;
    this.angle = 0;
    this.speed = 120/framePerSecond;
    this.size = 32;
    this.radian = this.angle * Math.PI/ 180.0;
    this.headX = this.x + this.size / 2 + Math.cos(this.radian) * this.size / 2;
    this.headY = this.y + this.size / 2 + Math.sin(this.radian) * this.size / 2;
    this.bullets = [];
    this.health = 100;
  }

  moveTop(){
    if(this.y + Math.sin(this.radian) * this.speed>  0 && this.y + Math.sin(this.radian) * this.speed < canvas.height - this.size 
      && this.x + Math.cos(this.radian) * this.speed > 0 && this.x + Math.cos(this.radian) * this.speed < canvas.width - this.size){
      this.y += Math.sin(this.radian) * this.speed;
      this.x += Math.cos(this.radian) * this.speed;
     
    }  
  }

  show(){
    this.headX = this.x + this.size / 2 + Math.cos(this.radian) * this.size / 2;
    this.headY = this.y + this.size / 2 + Math.sin(this.radian) * this.size / 2;
    this.drawImage(this.x, this.y, this.size, this.size, this.angle);
    for(var i = 0; i < this.bullets.length; i++){
      var bullet = this.bullets[i];
      if(bullet.x < -bullet.size || bullet.x > canvas.width - bullet.size 
        || bullet.y > canvas.height - bullet.size || bullet.y  < -bullet.size){
        this.bullets.splice(i,1);
      }
    }
    for(var i = 0; i < this.bullets.length; i++){
      this.bullets[i].move();
      this.bullets[i].draw();
    }
  }

  drawImage(x, y, w, h, angle){
    canvasContext.save();
    canvasContext.translate(x + w / 2, y + h / 2);
    canvasContext.rotate(- angle * Math.PI / 180.0);
    canvasContext.translate(-x - w / 2, -y - h / 2);
    canvasContext.drawImage(image, 0, 0, this.size, this.size, x, y, w, h);
    canvasContext.restore();
  }

  turnRight(){
    this.angle -= 10;
    this.radian = -this.angle * Math.PI/ 180.0;
  }

  turnLeft(){
    this.angle += 10;
    this.radian = -this.angle * Math.PI/ 180.0;
  }

  fire(){
    if(this.bullets.length < 5){
      this.bullets.push(new Bullet(this.headX, this.headY, this.radian));
    }
    
  }

  getDamage(){
    this.health -= 2;
  }
}
