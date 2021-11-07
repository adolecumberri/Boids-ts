

// Main code, initializer and animation loop runner.


/*---- Global Setup ----*/

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
let center = new Victor(size.width / 2, size.height / 2);

// Initialize Mouse
let mouse = {
    position: new Victor(innerWidth / 2, innerHeight / 2)
};

/*---- end Global Setup ----*/

/*---- Helper Functions ----*/

/**
 * Returns a random int between a min and a max
 *
 * @param  int | min | A minimum number
 * @param  int | max | A maximum number
 * @return int | The random number in the given range
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Returns the distance between two coordinates
 *
 * @param  int | x1 | Point 1's x coordinate
 * @param  int | y1 | Point 1's y coordinate
 * @param  int | x2 | Point 2's x coordinate
 * @param  int | y2 | Point 2's y coordinate
 * @return int | The distance between points 1 and 2
 */
function getDistance(x1, y1, x2, y2) {
    let xDist = x2 - x1;
    let yDist = y2 - y1;
    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

/**
 * Returns a random color from the colors array
 *
 * @param  array | colors | An array of color values
 * @return string | The random color value
 */
function randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Get coefficients based on normal distribution
 *
 * @param  int | mean | The mean value of the data set
 * @param  int | stdev | The standard deviation for the data set
 * @return int | A number from the data set
 */
function gaussian(mean, stdev) {
    let y2;
    let use_last = false;
    return function () {
        let y1;
        if (use_last) {
            y1 = y2;
            use_last = false;
        }
        else {
            let x1, x2, w;
            do {
                x1 = 2.0 * Math.random() - 1.0;
                x2 = 2.0 * Math.random() - 1.0;
                w = x1 * x1 + x2 * x2;
            } while (w >= 1.0);
            w = Math.sqrt((-2.0 * Math.log(w)) / w);
            y1 = x1 * w;
            y2 = x2 * w;
            use_last = true;
        }

        let retval = mean + stdev * y1;
        if (retval > 0)
            return retval;
        return -retval;
    }
}
let getCoefficient = gaussian(50, 9);
let getQuicknessCoefficient = gaussian(75, 7.5);

/**
 * Add Limit Magnitude function to Victor objects
 *
 * @param  int | max | The limit magnitude for the vector
 */
Victor.prototype.limitMagnitude = function (max) {

    if (this.length() > max) {
        this.normalize();
        this.multiply({ x: max, y: max });
    }

};

/*--- end Helper Functions ----*/

/*---- Loop and Initializing ----*/

// Checkbox Options
let walls = true;
let mouseSeek = false;
let collisions = false;
let maxBoids = 0;
// Set number of boids based on browser and screen size
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
let radius = size.width / 288;
if (size.width / 288 > 5) {
    radius = 5;
} else if (size.width / 288 < 3) {
    radius = 3;
}

let radiusCoefficients = [.5, .6, .7, .8, 1];

// Boid Attributes
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
let diversity = colors.length;
let quickness = 1;
let introversion = .5;
let racism = 0;
let speedIndex = size.width / 180;
if (size.width / 160 < 5) {
    speedIndex = 5;
} else if (size.width / 180 > 8) {
    speedIndex = 9;
}

// Create Boids Array
let boids = [];

/**
 * Create Boids Array
 *
 */
function createBoids() {

    // Instantiate all Boids
    for (i = 0; i < numBoids; i++) {

        // Generate introversion coefficient
        let introversionCoefficient = getCoefficient() / 100;
        let quicknessCoefficient = getQuicknessCoefficient() / 100;
        let racismCoefficient = getCoefficient() / 100;
        let radiusCoefficient = Math.floor(Math.random() * radiusCoefficients.length);

        // Generate random coords
        let x = Math.ceil(Math.random() * (size.width - (radius * 2))) + (radius); //added radius to let them be inside bounds.
        let y = Math.ceil(Math.random() * (size.height - (radius * 2))) + (radius); //added radius to let them be inside bounds.
        
        // For subsequent boids, check for collisions and generate new coords if exist
        if (i !== 0) {
            for (let j = 0; j < boids.length; j++) {
                if (getDistance(x, y, boids[j].x, boids[j].y) - (radius + boids[j].radius) < 0) {
                    x = Math.ceil(Math.random() * (size.width - (radius * 2))) + (radius);
                    y = Math.ceil(Math.random() * (size.height - (radius * 2))) + (radius);
                    j = -1;
                }
            }
        }

        // Add new Boid to array
        boids.push(new Boid({
            id: i,
            x: x,
            y: y,
            speedIndex: speedIndex,
            radius: radius,
            radiusCoefficient: radiusCoefficient,
            quickness: quickness,
            quicknessCoefficient: quicknessCoefficient,
            color: randomColor(colors),
            racism: racism,
            racismCoefficient: racismCoefficient,
            introversion: introversion,
            introversionCoefficient: introversionCoefficient
        }));
    }

}

/**
 * Setup and call animation function
 *
 */
function animate() {
    window.requestAnimationFrame(animate);

    // Calc elapsed time since last loop
    now = Date.now();
    elapsed = now - then;

    // FPS Reporting
    fpsReport++;
    if (fpsReport > 60) {
        fpsNum.innerHTML = Math.floor(1000 / elapsed);
        fpsReport = 0;
    }

    // If enough time has elapsed, draw the next frame
    if (elapsed > fpsInterval) {
        // Get ready for next frame by setting then=now, but also adjust for your
        // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
        then = now - (elapsed % fpsInterval);
        // Drawing Code
        c.clearRect(0, 0, canvas.width, canvas.height);
        // Update all boids
        for (let i = 0; i < boids.length; i++) {
            boids[i].update();
        }
    }
}

// Setup animation
let stop = false;
let frameCount = 0;
let fps, fpsInterval, startTime, now, then, elapsed;
let fpsNum = document.getElementById('fps-number');
let fpsReport = 58;

/**
 * Start Animation of Boids
 *
 */
function startAnimating() {
    let fps
    if (fps == null) { fps = 60; }
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    animate();
}

//Initalize program
createBoids();
startAnimating(60);

/*---- end Loop and Initializing ----*/

/*---- Event Listeners ----*/

/**
 * Update mouse positions on mousemove
 *
 */
addEventListener('mousemove', function (event) {
    mouse.position.x = event.clientX;
    mouse.position.y = event.clientY;
});

/**
 * Update boundary sizes on window resize
 *
 */
addEventListener('resize', function () {
    size.width = innerWidth;
    size.height = innerHeight;
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    center.x = size.width / 2;
    center.y = size.height / 2;
    if (innerWidth >= 1000 && !mobile) {
        document.getElementById('mobile-boids-controls').style.display = 'none';
    } else {
        document.getElementById('mobile-boids-controls').style.display = 'block';
    }
});

/*---- end Event Listeners ----*/

/*---- Inputs ----*/

// Hide Elements on Mobile
document.getElementById('collisions-mobile').style.display = 'none';
document.getElementById('mouse-seek-mobile').style.display = 'none';

// Mobile Closers
let mobileClosers = document.getElementsByClassName('boids-control-close');
for (let i = 0; i < mobileClosers.length; i++) {
    mobileClosers[i].onclick = function () {
        this.parentNode.classList.toggle('show');
        document.getElementById('mobile-boids-controls').style.display = 'block';
    }
}

// Walls
let wallsInput = document.getElementById('walls');
wallsInput.checked = true;
wallsInput.onclick = function () {
    if (!this.checked) {
        this.checked = false;
        wallsMobile.dataset.checked = false;
        wallsMobile.classList.toggle('boids-checkbox-on');
        walls = false;
    } else {
        this.checked = true;
        wallsMobile.dataset.checked = true;
        wallsMobile.classList.toggle('boids-checkbox-on');
        walls = true;
    }
}
let wallsMobile = document.getElementById('walls-mobile');
wallsMobile.dataset.checked = true;
wallsMobile.onclick = function () {
    if (this.dataset.checked == 'false') {
        this.dataset.checked = true;
        wallsInput.checked = true;
        this.classList.toggle('boids-checkbox-on');
        walls = true;
    } else {
        this.dataset.checked = false;
        wallsInput.checked = false;
        this.classList.toggle('boids-checkbox-on');
        walls = false;
    }
}

// Collision Detection
let collisionDetectionInput = document.getElementById('collision-detection');
collisionDetectionInput.checked = false;
collisionDetectionInput.onclick = function () {
    if (!this.checked) {
        this.checked = false;
        collisionDetectionMobile.dataset.checked = false;
        collisionDetectionMobile.classList.toggle('boids-checkbox-on');
        collisions = false;
    } else {
        this.checked = true;
        collisionDetectionMobile.dataset.checked = true;
        collisionDetectionMobile.classList.toggle('boids-checkbox-on');
        collisions = true;
    }
}
let collisionDetectionMobile = document.getElementById('collisions-mobile');
collisionDetectionMobile.dataset.checked = false;
collisionDetectionMobile.onclick = function () {
    if (this.dataset.checked == 'false') {
        this.dataset.checked = true;
        collisionDetectionInput.checked = true;
        this.classList.toggle('boids-checkbox-on');
        collisions = true;
    } else {
        this.dataset.checked = false;
        collisionDetectionInput.checked = false;
        this.classList.toggle('boids-checkbox-on');
        collisions = false;
    }
}

// Mouse Seek
let mouseSeekInput = document.getElementById('mouse-seek');
mouseSeekInput.checked = false;
mouseSeekInput.onclick = function () {
    if (!this.checked) {
        this.checked = false;
        mouseSeekMobile.dataset.checked = false;
        mouseSeekMobile.classList.toggle('boids-checkbox-on');
        mouseSeek = false;
    } else {
        this.checked = true;
        mouseSeekMobile.dataset.checked = true;
        mouseSeekMobile.classList.toggle('boids-checkbox-on');
        mouseSeek = true;
    }
}
let mouseSeekMobile = document.getElementById('mouse-seek-mobile');
mouseSeekMobile.dataset.checked = false;
mouseSeekMobile.onclick = function () {
    if (this.dataset.checked == 'false') {
        this.dataset.checked = true;
        mouseSeekInput.checked = true;
        this.classList.toggle('boids-checkbox-on');
        mouseSeek = true;
    } else {
        this.dataset.checked = false;
        mouseSeekInput.checked = false;
        this.classList.toggle('boids-checkbox-on');
        mouseSeek = false;
    }
}

// Introversion
let introversionControlContainer = document.getElementById('introversion-control-container');
let introversionInput = document.getElementById('introversion');
introversionInput.onchange = function () {
    introversion = this.value / 10;
    updateIntroversion(introversion);
}
let introversionMobile = document.getElementById('introversion-mobile');
introversionMobile.onclick = function () {
    document.getElementById('mobile-boids-controls').style.display = 'none';
    introversionControlContainer.classList.toggle('show');
}
function updateIntroversion(value) {
    for (let i = 0; i < boids.length; i++) {
        boids[i].introversion = value * boids[i].introversionCoefficient;
    }
}

// Speed
let speedControlContainer = document.getElementById('speed-control-container');
let speedInput = document.getElementById('speed');
speedInput.onchange = function () {
    quickness = this.value / 10 + .5;
    updateQuickness(quickness);
}
let speedMobile = document.getElementById('speed-mobile');
speedMobile.onclick = function () {
    document.getElementById('mobile-boids-controls').style.display = 'none';
    speedControlContainer.classList.toggle('show');
}
function updateQuickness(value) {
    for (let i = 0; i < boids.length; i++) {
        boids[i].quickness = value * boids[i].quicknessCoefficient;
        boids[i].maxSpeed = speedIndex * boids[i].quickness;
    }
}

// Racism
let racismControlContainer = document.getElementById('racism-control-container');
let racismInput = document.getElementById('racism');
racismInput.onchange = function () {
    racism = this.value / 5;
    updateRacism(racism);
}
let racismMobile = document.getElementById('racism-mobile');
racismMobile.onclick = function () {
    document.getElementById('mobile-boids-controls').style.display = 'none';
    racismControlContainer.classList.toggle('show');
}
function updateRacism(value) {
    for (let i = 0; i < boids.length; i++) {
        boids[i].racism = value * boids[i].racismCoefficient;
    }
}

// Diversity
let diversityControlContainer = document.getElementById('diversity-control-container');
let diversityInput = document.getElementById('diversity');
diversityInput.onchange = function () {
    diversity = this.value;
    updateDiversity(diversity);
}
let diversityMobile = document.getElementById('diversity-mobile');
diversityMobile.onclick = function () {
    document.getElementById('mobile-boids-controls').style.display = 'none';
    diversityControlContainer.classList.toggle('show');
}
function updateDiversity(value) {
    for (let i = 0; i < boids.length; i++) {
        boids[i].color = colors[i % value];
    }
}

/*---- end Inputs ----*/
