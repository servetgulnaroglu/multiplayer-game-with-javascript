class Bullet{
  constructor(x, y, radian, range){
    this.x = x;
    this.y = y;
    this.startX = x;
    this.startY = y;
    this.radian = radian;
    this.speed = 300/framePerSecond;
    this.size = 5;
    this.range = range;
  }

  move(){ 
    this.y += Math.sin(this.radian) * this.speed;
    this.x += Math.cos(this.radian) * this.speed; 
  }

  draw(){
    canvasContext.fillStyle = 'white';
    canvasContext.fillRect(this.x, this.y, this.size, this.size);
  }
  
  show(){
    this.move();
    this.draw();
  }
}
