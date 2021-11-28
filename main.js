const cellSize = 16;

const world = {
  cellSize: cellSize,
  width: Math.floor((screen.width - 2*cellSize)/cellSize),
  height: Math.floor((screen.availHeight - 4*cellSize)/cellSize)
};

class Snake {
  constructor(x, y, boundryX, boundryY) {
    this.x = x;
    this.y = y;
    this.boundry = {
      x: boundryX,
      y: boundryY
    };
    this.speed = {
      x: 1,
      y: 0
    };
    this.tail = [
      {
        x: this.x,
        y: this.y
      }
    ];
    this.score = 0;
    this.grabbed = false;
    
    for (let i = 0; i < 4; i++) {
      this.tail.push(this.tail.at(0));
    }
  }
  
  update() {    
    this.x = this.x + this.speed.x;
    this.y = this.y + this.speed.y;

    if (snake.x < 0) snake.x = this.boundry.x - 1;
    if (snake.x >= this.boundry.x) snake.x = 0;
    if (snake.y < 0) snake.y = this.boundry.y - 1;
    if (snake.y >= this.boundry.y) snake.y = 0;
    
    this.tail.unshift({
      x: this.x,
      y: this.y
    });
    
    this.tail.pop();
    
    this.tail.forEach((e, i, o) => {
      if (i !== 0 && e.x === this.x && e.y === this.y && 
          ![...Array(4).keys()].includes(frameCount)) {
        alert('Game over');
        setup();
      }
    });
  }
}

class Food {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  
  spawn() {
    this.x = floor(random(0, world.width));
    this.y = floor(random(0, world.height));
  }
}

let snake, food;

function setup() {
  createCanvas(world.width * world.cellSize, world.height * world.cellSize);

  console.log(floor(world.height / 2));
  
  snake = new Snake(floor(world.width / 2), floor(world.height / 2), world.width, world.height);
  
  food = new Food(0, 0);
  food.spawn();
}

function draw() {
  background(25);
  
  snake.update();
  
  if (snake.x === food.x && snake.y === food.y) {
    snake.tail.push({
      x: snake.tail.at(0).x - snake.speed.x,
      y: snake.tail.at(0).y - snake.speed.y
    });
    
    snake.score += 50;
    
    food.spawn();
    snake.tail.forEach(e => {
      if (food.x === e.x && food.y === e.y) {      
        food.spawn();
      }  
    });
  }
  
  for (let i = 0; i < world.height; i++) {
    for (let j = 0; j < world.width; j++) {
      fill(35);
      rect(j * world.cellSize, i * world.cellSize, world.cellSize, world.cellSize);
    }
  }
  
  fill(255, 100, 0);
  
  ellipseMode(CORNER);
  push();
  translate(food.x * world.cellSize + world.cellSize / 2, food.y * world.cellSize + world.cellSize / 2);
  rotate(frameCount);
  ellipse(-world.cellSize / 2 - 2, -world.cellSize / 2, world.cellSize + 4, world.cellSize);
  pop();
  
  for (let i = snake.tail.length - 1; i >= 0; i--) {
    if (i === 0) {
      fill(255, 50, 100);
      
      rect(snake.tail[i].x * world.cellSize, snake.tail[i].y * world.cellSize, world.cellSize, world.cellSize, 5);
      
      push();
      strokeWeight(0.6);
      fill(0);
      stroke(255);
      translate(snake.tail[i].x * world.cellSize + world.cellSize / 2, snake.tail[i].y * world.cellSize + world.cellSize / 2);
      rotate(createVector(snake.speed.x, snake.speed.y).heading());
      circle(0, 0, world.cellSize / 4);
      pop();
      
      push();
      strokeWeight(0.6);
      fill(0);
      stroke(255);
      translate(snake.tail[i].x * world.cellSize + world.cellSize / 2, snake.tail[i].y * world.cellSize + world.cellSize / 2);
      rotate(createVector(snake.speed.x, snake.speed.y).heading());
      circle(0, -world.cellSize / 2.5, world.cellSize / 4);
      pop();
    }
    else {
      if (i === snake.tail.length - 1) {
        fill(150, 10, 0);
      }
      else {  
        fill(200, 0, 0);
      }
      rect(snake.tail[i].x * world.cellSize, snake.tail[i].y * world.cellSize, world.cellSize, world.cellSize, 5);
    }
  }
  
  fill(color('rgba(170, 170, 170, .7)'));
  textFont('consolas, monospace');
  textSize(20);
  text(snake.score, 10, 20);
  
  
  frameRate(8 + (snake.tail.length * 0.5));
}

function keyPressed() {
  if (['w', 'arrowup'].includes(str(key).toLowerCase()) && snake.speed.y != 1) {
    snake.speed = {
      x: 0,
      y: -1
    }
  }
  else if (['a', 'arrowleft'].includes(str(key).toLowerCase()) && snake.speed.x != 1) {
    snake.speed = {
      x: -1,
      y: 0
    }
  }
  else if (['s', 'arrowdown'].includes(str(key).toLowerCase()) && snake.speed.y != -1) {
    snake.speed = {
      x: 0,
      y: 1
    }
  }
  else if (['d', 'arrowright'].includes(str(key).toLowerCase()) && snake.speed.x != -1) {
    snake.speed = {
      x: 1,
      y: 0
    }
  }
}

function touchMoved(e) {
  if (Math.abs(mouseX - pmouseX) > Math.abs(mouseY - pmouseY) && Math.sign(mouseX - pmouseX) !== -snake.speed.x) {
    snake.speed = {
      x: Math.sign(mouseX - pmouseX),
      y: 0
    }
  }
  else if (Math.abs(mouseY - pmouseY) > Math.abs(mouseX - pmouseX) && Math.sign(mouseY - pmouseY) !== -snake.speed.y) {
    snake.speed = {
      x: 0,
      y: Math.sign(mouseY - pmouseY)
    }
  }
}
