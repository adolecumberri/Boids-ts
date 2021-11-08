
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
        this.velocity = new Victor();
        this.acceleration = new Victor();
        this.radius = radius * radiusCoefficients[radiusCoefficient];
        this.color = color;
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
}