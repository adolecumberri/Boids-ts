# boids-js

> Flock simulation and boids



Flock simulation with _canvas_ and _gl-vec2_ 

For the original code see here:

- https://github.com/shiffman/The-Nature-of-Code-Examples-p5.js/tree/master/chp06_agents/NOC_6_09_Flocking
- https://github.com/shiffman/The-Nature-of-Code-Examples-p5.js/tree/master/chp06_agents/NOC_6_02_Arrive

<!-- 
```js
import { Flock, Boids, heading } from 'boid-ts'

const flock = new Flock()
let target: vec2 = null

for (let i = 0; i < 60; i++) {
  const opts = {
    center: [0, 0],
    canvasSize: [canvasWidth, canvasHeight],

    velocity: [Math.random(), Math.random()],
    r: 3,
    maxspeed: 3,
    maxforce: 0.05,

    separationScale: 1.5,
    alignScale: 1.0,
    cohesionScale: 1.0,

    desiredSeparation: 25,
    neighborDistance: 50,
  }

  let b = new Boid(opts)
  flock.addBoid(b)
}

function loop() {
  flock.run()

  context.clearRect(0, 0, width, height)

  for (let i = 0; i < flock.boids.length; ++i) {
    const boid = flock.boids[i]
    const x = boid.position[0]
    const y = boid.position[1]
    const theta = heading(boid.velocity) + Math.PI / 2

    context.save()
    context.translate(x, y)
    context.rotate(theta)
    context.beginPath()
    context.moveTo(0, -r * 2)
    context.lineTo(-r, r * 2)
    context.lineTo(r, r * 2)
    context.closePath()
    context.stroke()
    context.restore()
  }
  requestAnimationFrame(loop)
}
requestAnimationFrame(loop)
``` -->

