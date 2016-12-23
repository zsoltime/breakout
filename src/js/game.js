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
const brickSize = {};

function setup() {
  const canvas = createCanvas(600, 400);
  canvas.parent(game);
  paddle = Paddle();
  ball = Ball();

  // it should be in the Ball factory
  brickSize.width = width / 10;
  brickSize.height = Math.ceil((height / 3) / 8);

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 8; j++) {
      let pos = {
        x: brickSize.width * i,
        y: brickSize.height * j
      }
      let value = j < 2 ? 7 : j < 4 ? 5 : j < 6 ? 3 : 1;
      bricks.push(Brick(pos, value));
    }
  }
}

function draw() {
  clear();
  paddle.render();
  ball.render();

  for (let i = 0; i < bricks.length; i++) {
    bricks[i].render();
  }
}

function keyPressed() {}

function Brick(pos, value) {
  let color;

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
    strokeWeight(1);
    fill(color);
    rect(pos.x, pos.y, pos.x + brickSize.width, pos.y + brickSize.height);
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
  let velocity = createVector(0, 0);

  function render() {
    stroke(255);
    strokeWeight(size);
    point(pos.x, pos.y);
  }

  function move() {}

  return {
    render,
    move,
    pos
  }
}

function Paddle() {
  let size = width / 8;
  let pos = createVector(width / 2, height - padding);
  let velocity = createVector(0, 0);

  function render() {
    stroke(255);
    strokeWeight(4);
    line(pos.x - size / 2, pos.y, pos.x + size / 2, pos.y);
  }

  function move() {}

  return {
    render,
    move,
    pos
  }
}
