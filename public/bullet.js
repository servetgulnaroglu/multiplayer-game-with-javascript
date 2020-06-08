class Bullet{
  constructor(x, y, radian){
    this.x = x;
    this.y = y;
    this.radian = radian;
    this.speed = 240/framePerSecond;
    this.size = 5;
  }

  move(){ 
    this.y += Math.sin(this.radian) * this.speed;
    this.x += Math.cos(this.radian) * this.speed;
  }

  draw(){
    canvasContext.fillStyle = 'white';
    canvasContext.fillRect(this.x, this.y, this.size, this.size);
  }
}
