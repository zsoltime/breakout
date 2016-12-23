'use strict';

const game = document.getElementById('game');
const colorRed = '#ff4436';
const colorOrange = '#ff9800';
const colorGreen = '#8bc34a';
const colorYellow = '#ffd740';
const padding = 20;
let paddle;
let ball;
let bricks = [];
let lastlyPressed;

function setup() {
  const canvas = createCanvas(600, 400);
  canvas.parent(game);
  paddle = Paddle();
  ball = Ball();

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 10; j++) {
      let pos = { row: i, col: j };
      let value = i < 2 ? 7 : i < 4 ? 5 : i < 6 ? 3 : 1;
      bricks.push(Brick(pos, value));
    }
  }
}

function draw() {
  clear();
  paddle.render();
  paddle.update();
  ball.render();
  ball.update();

  for (let i = 0; i < bricks.length; i++) {
    bricks[i].render();
  }
}

function keyPressed() {
  lastlyPressed = keyCode;

  if (keyCode === LEFT_ARROW) {
    paddle.move(-1);
  }

  if (keyCode === RIGHT_ARROW) {
    paddle.move(1);
  }
}

function keyReleased() {
  if (keyCode === lastlyPressed) {
    paddle.move(0);
  }
}

function Brick(pos, value) {
  let color;
  let w = width / 10;
  let h = Math.ceil((height / 3) / 8);

  if (value === 1) {
    color = colorYellow;
  }
  else if (value === 3) {
    color = colorGreen;
  }
  else if (value === 5) {
    color = colorOrange;
  }
  else if (value === 7) {
    color = colorRed;
  }

  function render() {
    stroke(55);
    strokeWeight(0.25);
    fill(color);
    rect(w * pos.col, h * pos.row, w, h);
  }

  return {
    render,
    pos,
    value
  }
}

function Ball() {
  let size = 8;
  let pos = createVector(width / 2, height - padding - size / 2);
  let velocity = createVector(random(-2, 2), -1);
  let speed = 5;

  velocity = velocity.mult(speed);

  function render() {
    stroke(255);
    strokeWeight(size);
    point(pos.x, pos.y);
  }

  function update() {
    pos.add(velocity);
    bounce();
  }

  function bounce() {
    if (pos.x <= 0 || pos.x >= width) {
      velocity.x *= -1;
    }
    if (pos.y <= 0 || pos.y >= height) {
      velocity.y *= -1;
    }
  }

  return {
    render,
    update,
    bounce,
    pos
  }
}

function Paddle() {
  let size = width / 8;
  let pos = createVector(width / 2, height - padding);
  let velocity = createVector(0, 0);
  let speed = 7;

  function render() {
    stroke(255);
    strokeWeight(4);
    line(pos.x - size / 2, pos.y, pos.x + size / 2, pos.y);
  }

  function update() {
    pos.x += velocity.x;
    pos.x = constrain(pos.x, size / 2, width - size / 2);
  }

  function move(direction) {
    velocity.x = direction * speed;
  }

  return {
    render,
    update,
    move,
    pos
  }
}
