import { Flock } from '../Flock'
import { Boid, BoidOptions } from '../Boid'
import { RandomSeed, create as createRandom } from 'random-seed'
import { create as createVector, set, vec2 } from 'gl-vec2'
import { heading } from '../gl-vec2-utils'
import { drawBoid } from './draw-utils';

let divCount = document.getElementById("flame-count");
//para los FPS
let lastLoop = new Date().getTime();
let fps = 0;
let flock: Flock;
let w = 0;
let h = 0;
const randomGenerator: RandomSeed = createRandom('dudee')
const random = randomGenerator.floatBetween

const CANVAS_WITH_1 = false
export const scale = window.devicePixelRatio || 1;

const normalizationConst = CANVAS_WITH_1 ? 600 : 1

function getBoidOpts(canvasWidth: number, canvasHeight: number): BoidOptions {
  return {
    center: [canvasWidth / 2, canvasHeight / 2],
    canvasSize: [canvasWidth, canvasHeight],

    velocity: set(
      createVector(),
      random(-1, 1) / normalizationConst,
      random(-1, 1) / normalizationConst,
    ),
    r: 3 / normalizationConst,
    maxspeed: 3 / normalizationConst,
    maxforce: 0.05 / normalizationConst,

    separationScale: 1.5,
    alignScale: 1.0,
    cohesionScale: 1.0,

    desiredSeparation: 25 / normalizationConst,
    neighborDistance: 50 / normalizationConst,
  }
}

const loadFps = () => {
  let thisLoop = new Date().getTime();
  fps = Math.floor(1000 / (thisLoop - lastLoop));
  lastLoop = thisLoop;
  divCount.innerHTML = ""+fps;
  
  return fps;
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

  // const onMouseMove = (ev: MouseEvent) => {
  //   target = [ev.pageX * scale, ev.pageY * scale];
  // }
  const onMouseUp = (ev: MouseEvent) => {
    target = null;
    // document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  }

  document.addEventListener('mousedown', onMouseDown);



  let boidSizeRatio = 0.5; //
  let targetSide = 100; //tamaño del target.

  function loop() {
    flock.run(target)

    // context.clearRect(0, 0, width, height)
    context.fillStyle = "#f5f5dc2a";
    if (target) {
      context.strokeRect(target[0] - targetSide / 2, target[1] - targetSide / 2, targetSide, targetSide);
      // context.fillStyle = "#f5f5dc";
    }
    context.fillRect(0, 0, width, height)

    context.fillStyle = 'black'
    context.strokeStyle = 'black';
    loadFps();

    for (let i = 0; i < flock.boids.length; ++i) {
      const boid = flock.boids[i]
      const x = boid.position[0];
      const y = boid.position[1];
      const theta = heading(boid.velocity) + Math.PI / 2
      drawBoid(context, x, y, theta, boid.r * boidSizeRatio);
    }

  

   
    requestAnimationFrame(loop)

  }

  requestAnimationFrame(loop)
}


setInterval( ( )=> {
  if(fps > 100){
    // for(let i = 0; i < 5; i++){
      let b = new Boid(getBoidOpts(w, h));
      flock.addBoid(b);
    // }
  
    
  }
}, 250);
