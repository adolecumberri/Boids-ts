
//canvas y ctx son globales.


class Boid {
    constructor({
        radius,
        radiusCoefficient,
        color,
    }) {
        let w = canvas.offsetWidth;
        let h = canvas.offsetHeight;

        this.position = new Victor(this.rand(w), this.rand(h));
        this.velocity = new Victor(
            this.rand(1.5, -1.5),
            this.rand(1.5, -1.5)
        );
        this.acceleration = new Victor(0, 0);
        this.radius = radius * radiusCoefficients[radiusCoefficient];
        this.color = color;
    }


    //align boids with the others
    align(boids) {
        //distancia a la que el boid mira alrededor
        let perceptionRadius = 70;
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
            steering.x /= boids.length;
            steering.y /= boids.length;
            
            steering.subtract(this.velocity)
        }

        return steering;
    }


    flock ( boids ) {
        let alignment = this.align(boids);
        this.acceleration = alignment;
    }


    //actualiza los boids
    update() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
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