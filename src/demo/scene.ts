import { Flock } from '../Flock'
import { Boid, BoidOptions } from '../Boid'
import { RandomSeed, create as createRandom } from 'random-seed'
import { create as createVector, set, vec2 } from 'gl-vec2'
import { heading } from '../gl-vec2-utils'
import { drawBoid } from './draw-utils';

let fpsCount = document.getElementById("flame-count");
let boidsCount = document.getElementById("boids-number");
let trailChecker = document.getElementById("trail-check");

//para los FPS
let lastLoop = new Date().getTime();
let fps = 0;
let flock: Flock;
let w = 0;
let h = 0;
let trail = false; //tienen "cola" los boids?

const randomGenerator: RandomSeed = createRandom('dudee')
const random = randomGenerator.floatBetween

export const scale = window.devicePixelRatio || 1;

function getBoidOpts(canvasWidth: number, canvasHeight: number): BoidOptions {
  return {
    center: [canvasWidth / 2, canvasHeight / 2],
    canvasSize: [canvasWidth, canvasHeight],

    velocity: set(
      createVector(),
      random(-1, 1) /  1.5,
      random(-1, 1) /  1.5,
    ),
    r: 3 ,
    maxspeed: 2 /  1.3,
    maxforce: 0.05 ,

    separationScale: 1.5,
    alignScale: 1.0,
    cohesionScale: 1.0,

    desiredSeparation: 25 ,
    neighborDistance: 50 ,
  }
}

const loadFps = () => {
  let thisLoop = new Date().getTime();
  fps = Math.floor(1000 / (thisLoop - lastLoop));
  lastLoop = thisLoop;
  fpsCount.innerHTML = `${fps} fps`;

  return fps;
}

const loadBoidsCounter = () => {
  boidsCount.innerHTML = `${flock.boids.length} boids`;
}

export function createScene(context: CanvasRenderingContext2D, width: number, height: number) {
  flock = new Flock()
  let target: vec2 = null
  w = width;
  h = height;
  for (let i = 0; i < 50; i++) {
    let b = new Boid(getBoidOpts(width, height))
    flock.addBoid(b)
  }

  const onMouseDown = (ev: MouseEvent) => {
    target = [ev.pageX * scale, ev.pageY * scale];
    // document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }

  const onMouseUp = (ev: MouseEvent) => {
    target = null;
    // document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  }

  document.addEventListener('mousedown', onMouseDown);

  const trailChanged = () => {
    console.log("changed");
    trail = !trail;
  }
  console.log(trailChecker);
  trailChecker.addEventListener("change", trailChanged)


  let boidSizeRatio = 0.5; //
  let targetSide = 100; //tamaño del target.
  let boidColor = trail ? "#f5f5dc2a" : "#f5f5dc";
  function loop() {
    flock.run(target)

    // context.clearRect(0, 0, width, height)
    context.fillStyle = trail ? "#f5f5dc2a" : "#f5f5dc";
    if (target) {
      context.strokeRect(target[0] - targetSide / 2, target[1] - targetSide / 2, targetSide, targetSide);
      // context.fillStyle = "black";
    }
    context.fillRect(0, 0, width, height)
    // context.fillStyle = 'black'
    context.strokeStyle = 'black';
    // loadFps();

    for (let i = 0; i < flock.boids.length; ++i) {
      const boid = flock.boids[i]
      const x = boid.position[0];
      const y = boid.position[1];
      const theta = heading(boid.velocity) + Math.PI / 2
      drawBoid(context, x, y, theta, boid.r * boidSizeRatio);
    }




    requestAnimationFrame(loop)

  }

  requestAnimationFrame(loop);
}

let intervalId = setInterval(() => {
  if ( flock.boids.length < 300) {
    let b = new Boid(getBoidOpts(w, h));
    flock.addBoid(b);
    loadBoidsCounter();
  } else {
    // clearInterval(intervalId);
  }
}, 250);
