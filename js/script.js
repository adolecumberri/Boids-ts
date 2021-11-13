


function createBoids() {

    // Instantiate all Boids
    for (i = 0; i < numBoids; i++) {

        // Generate introversion coefficient
        let introversionCoefficient = getCoefficient() / 120;
        let quicknessCoefficient = getQuicknessCoefficient() / 150;
        let racismCoefficient = getCoefficient() / 100;
        // let radiusCoefficient = Math.floor(Math.random() * radiusCoefficients.length);

        // Generate random coords
        let x = Math.ceil(Math.random() * (size.width - (radius * 2))) + (radius); //added radius to let them be inside bounds.
        let y = Math.ceil(Math.random() * (size.height - (radius * 2))) + (radius); //added radius to let them be inside bounds.
        let victorLocal = new Victor(x,y);
        // For subsequent boids, check for collisions and generate new coords if exist
        if (i !== 0) {
            for (let j = 0; j < boids.length; j++) {
                if (  victorLocal.distance(new Victor(boids[j].x, boids[j].y)) - (radius + boids[j].radius) < 0) {
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
            // radiusCoefficient: radiusCoefficient,
            quickness: quickness,
            quicknessCoefficient: quicknessCoefficient,
            color: colors[1],
            racism: racism,
            racismCoefficient: racismCoefficient,
            introversion: introversion,
            introversionCoefficient: introversionCoefficient
        }));
    }

}



// Setup animation
let stop = false;
let frameCount = 0;
let fps, fpsInterval, startTime, now, then, elapsed;
let fpsNum = document.getElementById('fps-number');
let fpsReport = 58;


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
    if (fpsReport > 60 && fpsNum) {
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

/**
 * Start Animation of Boids
 *
 */
function startAnimating() {
    let fps;
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

addEventListener('mousemove', function (event) {
    mouse.position.x = event.clientX;
    mouse.position.y = event.clientY;
});

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