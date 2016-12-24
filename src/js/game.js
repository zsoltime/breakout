'use strict';

const game = document.getElementById('game');
const colorRed = '#ff4436';
const colorOrange = '#ff9800';
const colorGreen = '#8bc34a';
const colorYellow = '#ffd740';
const colorBg = '#d7ccc8';
const padding = 20;
let paddle;
let ball;
let stats;
let bricks = [];
let broken = 0;
let lastlyPressed = 0;
let hitTop = false;
const speedIncrease = {
  available: {
    hitRed: false,
    hitOrange: false,
  },
  used: {
    hitRed: false,
    hitOrange: false,
    brokenFour: false,
    brokenTwelve: false
  }
}

function setup() {
  const canvas = createCanvas(600, 400);
  canvas.parent(game);
  paddle = Paddle();
  ball = Ball();
  stats = Stats();

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 14; j++) {
      let pos = { row: i, col: j };
      let value = i < 2 ? 7 : i < 4 ? 5 : i < 6 ? 3 : 1;
      bricks.push(Brick(pos, value));
    }
  }
}

function draw() {
  background(colorBg);
  paddle.render();
  paddle.update();
  ball.render();
  ball.update();
  stats.render();

  for (let i = bricks.length - 1; i >= 0; i--) {
    bricks[i].render();

    if (bricks[i].hit(ball)) {
      broken += 1;
      stats.addPoints(bricks[i].value);

      if (bricks[i].value === 5) {
        speedIncrease.available.hitOrange = true;
      }
      if (bricks[i].value === 7) {
        speedIncrease.available.hitRed = true;
      }

      ball.bounceBack();
      bricks.splice(i, 1);
    }
  }

  // 1, after 4 hits
  // 2, after 12 hits
  // 3, after hits first orange
  // 4, after hits first red
  // TODO: It should be a function :)
  if (broken === 4 && !speedIncrease.used.brokenFour) {
    speedIncrease.used.brokenFour = true;
    ball.increaseSpeed();
  }

  if (broken === 12 && !speedIncrease.used.brokenTwelve) {
    speedIncrease.used.brokenTwelve = true;
    ball.increaseSpeed();
  }

  if (speedIncrease.available.hitOrange && !speedIncrease.used.hitOrange) {
    speedIncrease.used.hitOrange = true;
    ball.increaseSpeed();
  }

  if (speedIncrease.available.hitRed && !speedIncrease.used.hitRed) {
    speedIncrease.used.hitRed = true;
    ball.increaseSpeed();
  }

  if (ball.hitTop() && !hitTop) {
    hitTop = true;
    paddle.reduceSize();
  }

  if (paddle.hit(ball)) {
    ball.bounceBack();
  }

  if (ball.isOffscreen()) {
    let lives = stats.takeLife();
    if (lives === 0) {
      console.log('game over');
      noLoop();
    }
    // set the ball and paddle back to the middle?
    paddle = Paddle(); // should be half sized if already hit the top!
    ball = Ball();

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
    lastlyPressed = 0;
    paddle.move(0);
  }
}

function Brick(pos, value) {
  let color;
  let w = width / 14;
  let h = Math.ceil((height / 3) / 8);
  let x = w * pos.col;
  let y = h * pos.row;

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
    rect(x, y, w, h);
  }

  function hit(ball) {
    return ball.pos.x >= x && ball.pos.x <= x + w && ball.pos.y <= y + h;
  }

  return {
    render,
    hit,
    pos,
    value
  }
}

function Ball() {
  let size = 8;
  let pos = createVector(width / 2, height - padding - size / 2);
  let velocity = createVector(random(-1, 1), -1);
  let speed = 3;

  velocity = velocity.mult(speed);

  function render() {
    stroke(255);
    strokeWeight(size);
    point(pos.x, pos.y);
  }

  function bounceBack() {
    velocity.y *= -1;
  }

  function update() {
    pos.add(velocity);
    bounce();
  }

  function bounce() {
    if (pos.x <= 0 || pos.x >= width) {
      velocity.x *= -1;
    }
    if (pos.y <= 0) {
      velocity.y *= -1;
    }
  }

  function increaseSpeed() {
    velocity = velocity.mult(1.15);
  }

  function hitTop() {
    return pos.y <= 0;
  }

  function isOffscreen() {
    return pos.y >= height;
  }

  return {
    render,
    update,
    bounce,
    bounceBack,
    increaseSpeed,
    hitTop,
    isOffscreen,
    pos,
    size
  }
}

function Paddle() {
  let size = width / 6;
  let weight = 4;
  let pos = createVector(width / 2, height - weight / 2);
  let velocity = createVector(0, 0);
  let speed = 7;

  function render() {
    stroke(255);
    strokeWeight(weight);
    line(pos.x - size / 2, pos.y, pos.x + size / 2, pos.y);
  }

  function update() {
    pos.x += velocity.x;
    pos.x = constrain(pos.x, size / 2, width - size / 2);
  }

  function move(direction) {
    velocity.x = direction * speed;
  }

  function hit(ball) {
    return ball.pos.y + ball.size / 2 > pos.y - weight / 2 && Math.abs(ball.pos.x - pos.x) < size / 2;
  }

  function reduceSize() {
    size = size / 2;
  }

  return {
    render,
    update,
    move,
    hit,
    reduceSize,
    pos,
    size
  }
}

function Stats() {
  let score = 0;
  let lives = 3;

  function addPoints(points) {
    score += points;
  }

  function takeLife() {
    lives -= 1;
    return lives;
  }

  function render() {
    noStroke();
    fill(55);
    text(`Score: ${score}`, padding, height - padding / 2);
    text(`Balls: ${lives}`, width - padding * 3, height - padding / 2);
  }

  return {
    addPoints,
    takeLife,
    render
  }
}
