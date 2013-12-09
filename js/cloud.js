define([], function() {

    /**
     * Cloud consisting of particles.
     *
     * @param {number} initialParticleAmount - The initial amount of particles.
     * @param {number} maxParticleAmount - The highest amount of particles handled by Cloud.
     * @constructor
     */
    function Cloud(initialParticleAmount, maxParticleAmount) {
        var data = new Float32Array(maxParticleAmount * Particle.ELEMENT_AMOUNT);
        var particles = new Array(maxParticleAmount);
        var particleAmount = 0;

        while (initialParticleAmount--)
            addParticle();

        /**
         * Adds one random particle to cloud. If the amount of particles exceeds the maximum amount given at Cloud
         * creation, the method fails and throws an exception.
         */
        this.addParticle = addParticle;

        function addParticle() {
            var offsetBegin = (particleAmount * Particle.ELEMENT_AMOUNT);
            var offsetEnd = offsetBegin + Particle.ELEMENT_AMOUNT;

            var dataView = data.subarray(offsetBegin, offsetEnd);

            particles[particleAmount] = new Particle(dataView);
            particleAmount++;
        }

        /**
         * All particle data handled by the Cloud is organized in a single Float32Array, with each particle occupying
         * Particle.ELEMENT_AMOUNT elements of data in the array. How those elements are used is described in the
         * documentation for Particle.
         *
         * This method exists solely in order to allow for acquiring particle data and uploading it to a WebGL vertex
         * buffer.
         *
         * @returns {Float32Array} View into cloud particle data array.
         */
        this.getData = function () {
            return data.subarray(0, particleAmount * Particle.ELEMENT_AMOUNT);
        };

        /**
         * All particle objects populating the cloud.
         *
         * @returns {Particle[]} Particles.
         */
        this.getParticles = function () {
            return particles.slice(0, particleAmount);
        };

        /**
         * Updates all Particle objects in cloud.
         *
         * @param time - Global time.
         */
        this.update = function (time) {
            particles.forEach(function (particle) {
                particle.update(time);
            });
        };
    }

    /**
     * A cloud particle.
     *
     * The data which make up the particle is stored in the referenced array, dataView. The array needs to have at least
     * Particle.ELEMENT_AMOUNT elements in order for a particle to be successfully created.
     *
     * @param {Float32Array} dataView - A reference to the array which stores the particle's data.
     * @constructor
     */
    function Particle(dataView) {
        this.dataView = dataView;

        this._speed = (Math.random() * 9.0) + 1.0;
        this._offsetX = Math.random() * Math.PI * 2;
        this._offsetY = Math.random() * Math.PI * 2;
        this._offsetZ = Math.random() * Math.PI * 2;

        this.setColor(
            0.2 + 0.5 * Math.random(),
            0.1 + 0.1 * Math.random(),
            0.1 + 0.9 * Math.random(),
            0.3 + 0.7 * Math.random()
        );
        this.setPosition(0, 0, 0);
    }

    /**
     * The amount of elements used in an array to store all data of a Particle.
     *
     * Read-only property.
     *
     * @type {number}
     * @property Particle.ELEMENT_AMOUNT
     */
    Object.defineProperty(Particle, "ELEMENT_AMOUNT", { value: 8 });

    /**
     * Set new particle color.
     *
     * Each parameter given ought to be a number between 0.0 and 1.0.
     *
     * @param {number} r - Red.
     * @param {number} g - Green.
     * @param {number} b - Blue.
     * @param {number} a - Alpha.
     */
    Particle.prototype.setColor = function (r, g, b, a) {
        this.dataView[4] = r;
        this.dataView[5] = g;
        this.dataView[6] = b;
        this.dataView[7] = a;
    };

    /**
     * Set new particle position.
     *
     * Each parameter given ought to be a number between -1.0 and 1.0.
     *
     * @param {number} x - X-coordinate.
     * @param {number} y - Y-coordinate.
     * @param {number} z - Z-coordinate.
     */
    Particle.prototype.setPosition = function (x, y, z) {
        this.dataView[0] = x;
        this.dataView[1] = y;
        this.dataView[2] = z;
        this.dataView[3] = 1.0;
    };

    /**
     * Update particle position in relation the given time.
     *
     * @param {number} time - Time, preferably in seconds.
     */
    Particle.prototype.update = function (time) {
        this.setPosition(
            Math.sin(this._offsetX + time * this._speed),
            Math.cos(this._offsetY + time * this._speed),
            Math.sin(this._offsetZ + time * this._speed)
        );
    };

    return {
        Cloud: Cloud,
        Particle: Particle
    };
});