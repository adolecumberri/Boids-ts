// Set up canvas
const canvas = document.getElementById('boids');
const c = canvas.getContext('2d');

// Detect Mobile --- i es parte de las RegEx que ejecuta keysensitive comparaison
let mobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ? true : false;

// Set Size
let size = {
    width: window.innerWidth || document.body.clientWidth,
    height: window.innerHeight || document.body.clientHeight
}
canvas.width = size.width;
canvas.height = size.height;

//este vector se usa para evitar muros.
let center = new Victor(size.width / 2, size.height / 2);

// Initialize Mouse. es un vector que varia si hemos activado que los boids persigan el raton.
let mouse = {
    position: new Victor(innerWidth / 2, innerHeight / 2)
};

// opciones globales.
let walls = false;
let mouseSeek = false;
let collisions = false;
let maxBoids = 0;

// numero de boids.
if (mobile) {
    maxBoids = 150;
} else {
    maxBoids = 500;
}
let minBoids = 250;
let numBoids = Math.sqrt(canvas.width * canvas.height) / 2;
if (numBoids > maxBoids) {
    numBoids = maxBoids;
} else if (numBoids < minBoids) {
    numBoids = minBoids;
}

// Set possible radio  based on screen size
let radius = size.width / 400;
if (size.width / 450 > 7) {
    radius = 7;
} else if (size.width / 400 < 5) {
    radius = 5;
}

//coeficientes de radio que se le añade a los Boids para que tengan variacion de tamaño.
let radiusCoefficients = [.5, .6, .7, .3, .4];

// colores a seleccionar.
let colors = [
    '#4286f4',
    '#521195',
    '#41f4a0',
    '#f9f9f9',
    '#a341f4',
    '#f48341',
    '#f4e841',
    '#42ebf4'
];

// let colors = [
//     '#1f4f9d',
//     '#cc103b',
//     '#019ea5',
//     '#6d4c00',
//     '#6d23a9',
//     '#161708',
//     '#d0c860',
//     '#4b003e'
// ];


// tipo de colores.
let diversity = colors.length;
let quickness = 0.8; //velocidad
let introversion = 0.8; // distancia entre unos y otros
let racism = 0; //se separan de colores que no son los suyos.
let speedIndex = size.width / 180; //velocidad a la que van. (derrapan).
if (size.width / 160 < 5) {
    speedIndex = 5;
} else if (size.width / 180 > 8) {
    speedIndex = 9;
}

// Create Boids Array
let boids = [];