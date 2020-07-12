class Bullet{
  constructor(x, y, radian, range){
    this.x = x * 1.0;
    this.y = y * 1.0;
    this.startX = x;
    this.startY = y;
    this.radian = radian * 1.0;
    this.speed = 300 * 1.0/framePerSecond;
    this.size = 5;
    this.range = range;
  }

  move(){ 
    this.y += Math.sin(this.radian) * this.speed * 1.0;
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
