
//canvas y ctx son globales.


class Boid {
    constructor({
        radius,
        radiusCoefficient,
        color,
    }) {
        let w = canvas.offsetWidth;
        let h = canvas.offsetHeight;

        this.position = new Victor(w / 2, h / 2);
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
        let perceptionRadius = 100;
        let avg = new Victor(0, 0);
        let total = 0;

        for (let other of boids) {
            let distance = this.position.distance(other.position);
            
            if (other != this && distance < perceptionRadius) {
                avg.add(other.velocity);
                total++;
            }

        }

        if (total > 0) {
            avg.x /= boids.length;
            avg.y /= boids.length;
        }

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