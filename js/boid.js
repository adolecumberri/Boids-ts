
//canvas y ctx son globales.


class Boid {
    constructor({
        radius,
        radiusCoefficient,
        color,
    }) {

        this.position = new Victor(
            this.rand(size.width),
            this.rand(size.height)
        );
        this.velocity = new Victor(
            this.rand(1.5, -1.5),
            this.rand(1.5, -1.5)
        );
        this.acceleration = new Victor(0, 0);
        this.radius = radius * radiusCoefficients[radiusCoefficient];
        this.color = color;
        this.maxForce = new Victor(1, 1);
        this.maxSpeed = 2;
    }

    toLimit(vector, limit) {
      
        return new Victor (
            vector.x > limit ? limit: vector.x,
            vector.y > limit ? limit: vector.y
        );
              
    }

    edges() {
        if (this.position.x > size.width) {
            this.position.x = 0;
        } else if (this.position.x < 0) {
            this.position.x = size.width;
        } else if (this.position.y > size.height) {
            this.position.y = 0;
        } else if (this.position.y < 0) {
            this.position.y = size.height;
        }
    }


    //align boids with the others
    align(boids) {
        //distancia a la que el boid mira alrededor
        let perceptionRadius = 50;
        // vector direccion (steering es direccion)
        let steering = new Victor(0, 0);
        // total elementos cotejados
        let total = 0;

        for (let other of boids) {
            //calculo distancia entre puntos.
            let distance = this.position.distance(other.position);

            //si no es el elemento y 
            // esta dentro del rango de percepcion....
            if (other != this && distance < perceptionRadius) {
                //añado la direccion a un vector final
                steering.add(other.velocity);
                total++;
            }
        }

        if (total > 0) {
            //hago la media de la direccion final 
            // con el numero de elementos en boids
            if (steering.x === 0 || steering.y === 0) debugger;
            steering.divide(new Victor(total, total));
            steering.setLength(this.maxSpeed);
            steering.subtract(this.velocity);
            steering = this.toLimit(steering, this.maxForce);
        }

        return steering;
    }

    //align boids with the others
    cohesion(boids) {
        // parametro de distancia
        let neighborDist = 100;
        // direccion nueva
        let steering = new Victor(0, 0);
        //contador
        let total = 0;
        for (let i = 0; i < boids.length; i++) {
            //distancia acumulada
            let dist = this.position.distance(boids[i].position);
            if (dist > 0 && dist < neighborDist) {
                // direccion acumulada
                steering.add(boids[i].position);
                total++;
            }
        }
        if (total > 0) {
            steering.divide(new Victor(total, total));
            steering.subtract(this.position);
            steering.setLength(this.maxSpeed);
            steering.subtract(this.velocity);
            steering = this.toLimit(steering, this.maxForce);
        } 
        
        return steering;
        
    }


   

    flock(boids) {
        let alignment = this.align(boids);
        let cohesionData = this.cohesion(boids);
        this.acceleration = alignment;
        this.acceleration.add(cohesionData);
     

    }


    //actualiza los boids
    update() {
        this.position = this.position.add(this.velocity);
    
       
        this.velocity = this.velocity.add(this.acceleration);
       

        this.velocity = this.toLimit(this.velocity, this.maxSpeed);




    }

    show() {
        //inicio trazo
        ctx.beginPath();
        //dibujo circulo completo
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
        //añado color
        ctx.fillStyle = this.color;
        //relleno
        ctx.fill();
        //cierro trazo
        ctx.closePath();
    }


    rand(max, min = 0) {
        return Math.random() * (max - min) + min;
    }
}