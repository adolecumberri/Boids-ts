



class Boid {
   

    constructor(boid) {

        // Initial Properties
        this.id = boid.id; //
        this.position = new Victor(boid.x, boid.y); //
        // this.radius = boid.radius * radiusCoefficients[boid.radiusCoefficient]; //
        this.radius = boid.radius //
        this.introversionCoefficient = boid.introversionCoefficient;
        this.introversion = boid.introversion * this.introversionCoefficient;
        this.quicknessCoefficient = boid.quicknessCoefficient;
        this.quickness = boid.quickness * this.quicknessCoefficient;
        this.racismCoefficient = boid.racismCoefficient;
        this.racism = boid.racism * boid.racismCoefficient;
        this.color = boid.color;
        this.mass = (4 / 3) * Math.PI * Math.pow(this.radius, 3);

        // Speed & Velocity & Force
        this.maxSpeed = speedIndex * this.quickness;
        this.speed = this.maxSpeed * .5;
        let radians = Math.PI * rand(100, -99) / 100;
        this.velocity = new Victor(this.speed * Math.cos(radians), this.speed * Math.sin(radians));
        //Force and Accel
        this.maxForce = .5;

    }


    seek(target) {
        //un vector.
        let targetposition = target.clone();
        let diff = targetposition.subtract(this.position);
        let desired = new Victor(diff.x, diff.y);
        let buffer = target.radius ? target.radius + this.radius + 1 : this.radius * 2 + 1
        
        let dist = diff.magnitude();
        if (dist < buffer) {
            desired.x = 0;
            desired.y = 0;
        } else if (dist <= 100) {
            desired.normalize();
            desired.divide({ x: this.maxSpeed * dist / 100, y: this.maxSpeed * dist / 100 });
        } else {
            desired.limitMagnitude(this.maxSpeed);
        }
        desired.subtract(this.velocity);
        desired.limitMagnitude(this.maxForce);
        return desired;
    }


    separate(boids) {
        let sum = new Victor();
        let count = 0;
        for (let j = 0; j < boids.length; j++) {
            let racismMultiplier = 0;
            if (this.color != boids[j].color) {
                racismMultiplier = this.racism;
            }
            let desiredSeparation = this.radius + boids[j].radius + (25 * this.introversion) + (50 * racismMultiplier);
            let sep = this.position.clone().distance(boids[j].position);
            if ((sep > 0) && (sep < desiredSeparation)) {
                let thisposition = this.position.clone();
                let diff = thisposition.subtract(boids[j].position);
                diff.normalize();
                diff.divide({ x: sep, y: sep });
                sum.add(diff);
                count++;
            }
        }
        if (count > 0) {
            sum.divide({ x: count, y: count });
            sum.normalize();
            sum.multiply({ x: this.maxSpeed, y: this.maxSpeed });
            sum.subtract(this.velocity);
            sum.limitMagnitude(this.maxForce);
        }
        return sum;
    }

    //alinea lo boids, unos con otros respecto a una media.
    align(boids) {
        let neighborDist = 50;
        let sum = new Victor();
        let steer = new Victor();
        let count = 0;
        for (let i = 0; i < boids.length; i++) {
            let dist = this.position.distance(boids[i].position);
            if (dist > 0 && dist < neighborDist) {
                sum.add(boids[i].velocity);
                count++;
            }
        }
        if (count > 0) {
            sum.divide({ x: count, y: count });
            sum.normalize()
            sum.multiply({ x: this.maxSpeed, y: this.maxSpeed });
            steer = sum.subtract(this.velocity);
            steer.limitMagnitude(this.maxForce);
            return steer;
        } else {
            return steer;
        }
    }

    //separa los boids.
    cohesion(boids) {
        let neighborDist = 50;
        let sum = new Victor();
        let count = 0;
        for (let i = 0; i < boids.length; i++) {
            let dist = this.position.distance(boids[i].position);
            if (dist > 0 && dist < neighborDist) {
                sum.add(boids[i].position);
                count++;
            }
        }
        if (count > 0) {
            sum.divide({ x: count, y: count });
            return this.seek(sum);
        } else {
            return sum;
        }
    }

 
    avoidWalls() {

        //si es un movil, meto menos distancia.
        let buffer = mobile ? 5 : 15;

        if (this.distanceFromHorWall() < this.radius * buffer || this.distanceFromVertWall() < this.radius * buffer) {
            return this.seek(center);
        } else { return false; }

    }

  
    flock() {

        // Get Forces
        let alignForce = this.align(boids);
        let mouseForce = mouseSeek ? this.seek(mouse.position) : undefined;

        let separateForce = this.separate(boids);
        let cohesionForce = this.cohesion(boids);
        let avoidWallsForce = walls ? this.avoidWalls() : undefined;

        // Weight Forces
        // let alignWeight = 1.2;
        // let mouseWeight = mouseSeek ? 0.2 : undefined;
        let separateWeight = 1;
        let cohesionWeight = 1;
        let avoidWallsWeight = walls ? 1.2 : undefined;


        // Apply forces
        // this.applyForce(alignForce, alignWeight);
        // if (mouseSeek) this.applyForce(mouseForce, mouseWeight);
        this.applyForce(separateForce, separateWeight);
        this.applyForce(cohesionForce, cohesionWeight);
        if (walls && avoidWallsForce) this.applyForce(avoidWallsForce, avoidWallsWeight);

    }

    applyForce(force, coefficient) {
        if (!coefficient) { let coefficient = 1; }
        force.multiply({ x: coefficient, y: coefficient });
        this.velocity.add(force);
        this.velocity.limitMagnitude(this.maxSpeed);
    }


    nextPosition() {

        // Loop through behaviors to apply forces
        this.flock();

        // Update position
        this.position = this.position.add(this.velocity);

        // Collision detection if enabled
        if (collisions) { this.detectCollision(); }

        // Check edges for walls or overruns
        this.edgeCheck();

    }

    edgeCheck() {
        if (walls) {
            this.wallBounce();
        } else {
            this.borderWrap();
        }
    }

    borderWrap() {
        if (this.position.x < 0) {
            this.position.x = document.body.clientWidth;
        } else if (this.position.x > document.body.clientWidth) {
            this.position.x = 0;
        }
        if (this.position.y < 0) {
            this.position.y = document.body.clientHeight;
        } else if (this.position.y > document.body.clientHeight) {
            this.position.y = 0;
        }
    }

  
    wallBounce() {
        if (this.position.x <= this.radius) {
            this.position.x = this.radius;
        } else if (this.position.x >= document.body.clientWidth - this.radius) {
            this.position.x = document.body.clientWidth - this.radius;
        }
        if (this.position.y <= this.radius) {
            this.position.y = this.radius;
        } else if (this.position.y >= document.body.clientHeight - this.radius) {
            this.position.y = document.body.clientHeight - this.radius;
        }
        if (this.distanceFromHorWall() <= this.radius) {
            this.velocity.invertY();
        }
        if (this.distanceFromVertWall() <= this.radius) {
            this.velocity.invertX();
        }
    }

  
    distanceFromVertWall() {
        if (this.velocity.x > 0) {
            return document.body.clientWidth - (this.position.x);
        } else {
            return this.position.x;
        }

    }


    distanceFromHorWall() {
        if (this.velocity.y > 0) {
            return document.body.clientHeight - (this.position.y);
        } else {
            return this.position.y;
        }
    }


    draw() {
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
    }


    update() {

        this.nextPosition();
        this.draw();

    }

  
    detectCollision() {

        for (let i = 0; i < boids.length; i++) {
            if (this === boids[i]) { continue; }
            if( this.position.distance(boids[i].position) - (this.radius + boids[i].radius) < 0) {
                this.resolveCollision(this, boids[i]);
            }
        }
    }

  
    rotate(velocity, angle) {
        return {
            x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
            y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
        };
    }

    resolveCollision(boid, otherBoid) {

        let xVelocityDiff = boid.velocity.x - otherBoid.velocity.x;
        let yVelocityDiff = boid.velocity.y - otherBoid.velocity.y;

        let xDist = otherBoid.position.x - boid.position.x;
        let yDist = otherBoid.position.y - boid.position.y;

        // Prevent accidental overlap of boids
        if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

            // Grab angle between the two colliding boids
            let angle = -Math.atan2(otherBoid.position.y - boid.position.y, otherBoid.position.x - boid.position.x);

            // Store mass in let for better readability in collision equation
            let m1 = boid.mass;
            let m2 = otherBoid.mass;

            // Velocity before equation
            let u1 = this.rotate(boid.velocity, angle);
            let u2 = this.rotate(otherBoid.velocity, angle);

            // Velocity after 1d collision equation
            let v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
            let v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

            // Final velocity after rotating axis back to original position
            let vFinal1 = this.rotate(v1, -angle);
            let vFinal2 = this.rotate(v2, -angle);

            // Swap boid velocities for realistic bounce effect
            boid.velocity.x = vFinal1.x;
            boid.velocity.y = vFinal1.y;
            boid.velocity.limitMagnitude(boid.maxSpeed);

            otherBoid.velocity.x = vFinal2.x;
            otherBoid.velocity.y = vFinal2.y;
            otherBoid.velocity.limitMagnitude(otherBoid.maxSpeed);
        }

    }

}