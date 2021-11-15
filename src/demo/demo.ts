import { createFit } from 'canvas-fit-margin-ts'
import { createScene, scale } from './scene'


const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

export const fit = createFit(canvas, { scale });
document.querySelector('.canvas-container').appendChild(canvas)

function render(width: number, height: number) {
  createScene(ctx, width, height)
}

const onResize = () => {
  const [width, height] = fit()
  render(width * scale, height * scale)
}

onResize();
window.addEventListener('resize', onResize)

//si falla el cargado del modulo, elimina el canvas.
if ((module as any).hot) {
  (module as any).hot.dispose(() => canvas.remove());
}
