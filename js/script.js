let canvas = document.getElementById('boids');
const ctx = canvas.getContext('2d');

ctx.lineWidth = 15;

// los boids
const boids = [];

// Set Size
let size = {
    width: window.innerWidth || document.body.clientWidth,
    height: window.innerHeight || document.body.clientHeight
}
canvas.width = size.width;
canvas.height = size.height;

//coeficientes para los radios
let radiusCoefficients = [.5, .6, .7, .8, 1];
// Set possible radio  based on screen size
let generalRadius = size.width / 288;
if (size.width / 200 > 10) {
    generalRadius = 10;
} else if (size.width / 288 < 7) {
    generalRadius = 7;
}

//colores
let colors = [
    '#4286f4',
    '#f4416a',
    '#41f4a0',
    '#f9f9f9',
    '#a341f4',
    '#f48341',
    '#f4e841',
    '#42ebf4'
];




(function setUp() {

    //coeficiente seleccionado.
    let radiusCoefficient = Math.floor(Math.random() * radiusCoefficients.length);
    boids.push(new Boid({
        radius: generalRadius,
        radiusCoefficient,
        color: randomColor(colors)
    }));
})();



function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.getAttribute('height'));
    for (let boid of boids) {
        boid.show();
    }
    requestAnimationFrame(animate);

}


window.addEventListener('load', animate);



function randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)];
}