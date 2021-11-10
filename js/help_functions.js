
function rand( max, min = 0) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)];
}

// mean es la referencia, stdev es la variacion.
// Realmente genera una funcion con referencias. no se ejecuta como tal.
function gaussian(mean, stdev) {
    let y2 = 0;
    let use_last = false;
    return function () {
        let y1 = 0;
        if (use_last) {
            y1 = y2;
            use_last = false;
        }
        else {
            let x1 = 0, x2 = 0, w = 0;
            do {
                x1 = 2.0 * Math.random() - 1.0; //variaciones.
                x2 = 2.0 * Math.random() - 1.0; //variaciones.
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
let getQuicknessCoefficient = gaussian(65, 4.5);


//añado una funcion limitadora al objeto global Victor.
Victor.prototype.limitMagnitude = function (max) {

    if (this.length() > max) {
        this.normalize();
        this.multiply({ x: max, y: max });
    }

};