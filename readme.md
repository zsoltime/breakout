# Day 20 of My 3 Weeks Game Challenge

Today's game was originally built by Steve Wozniak and Steve Jobs. It's Breakout, using P5.js.

## User Stories

- [x] I can see eight rows of bricks on start, with each two rows a different colour
- [x] I can move the paddle with my arrow keys
- [x] I can use my paddle to hit back a ball
- [x] I can eliminate the bricks by hitting the ball against them
- [x] If I miss the ball's rebound, I lose a life
- [x] Once I hit the upper wall, my paddle shrinks to one-half of its size
- [x] I can see my score
- [x] I can earn points for every brick knocked down

## Next Steps

I don't really like that the ball is simply changing its Y position when hits the moving paddle. If the paddle is in move when the ball touches it, the ball should have a slightly different direction depending on the direction of the movement.
