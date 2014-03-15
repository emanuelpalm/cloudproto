define(["webgl", "utilities", "cloud", "analyzer", "programs"],
	function (WebGL, Utilities, Cloud, Analyzer, Programs) {

        /**
         * Creates a new benchmark program.
         *
         * @param {WebGLObject} gl - WebGL context.
         * @param {string} program - Cloud program string identifier.
         * @constructor
         */
		function Benchmarker(gl, program) {
		
			var PARTICLE_MAX_INITIAL = 524288;

			var cloudProgram = new Programs.Cloud(gl,
				Utilities.GET("resources/particle_" + program + ".vert"),
				Utilities.GET("resources/particle_" + program + ".frag")
			);

			var postProgram = new Programs.Post(gl,
				Utilities.GET("resources/post.vert"),
				Utilities.GET("resources/post.frag")
			);

			var particleMax = PARTICLE_MAX_INITIAL;
			var cloud = new Cloud.Cloud(0, particleMax);

            /**
             * Run benchmark.
             *
             * @param {number} runTime - Time, in seconds, to run benchmark.
             * @param {number} particleAmount - Amount of particles in cloud during benchmark.
             * @param {function} callback - Callback to fire with AnalyzerReport when benchmark is over.
             */
			this.runStatic = function (runTime, particleAmount, callback) {

                var analyzer = new Analyzer.Analyzer();
                cloud.setParticleAmount(particleAmount);

				var clock = new Utilities.Clock();
                var time = 0;

				(function tick() {

                    time = clock.getTimeElapsed();

					if (time <= runTime) {
						requestAnimationFrame(tick);

						cloud.update(time);
						postProgram.render(function () {
                            cloudProgram.render(cloud);
                        });

						analyzer.push(clock.getInterval());

					} else {
						callback(analyzer.generateReport());
					}
				})();

			};

            /**
             * Increases particle amount until the frame rendering time passes a given threshold time.
             *
             * @param {number} thresholdTime - Frame rendering time, in seconds, to converge at.
             * @param {number} stepSize - The amount of particles added each time the threshold is not reached.
             * @param {function} callback - Callback fired with particle amount and time elapsed on convergence.
             */
            this.runCalibrating = function (thresholdTime, callback) {

                console.log(thresholdTime);

                var clock = new Utilities.AverageIntervalClock(32);
                var particleAmount = 32;
                
                cloud.setParticleAmount(particleAmount);

                (function tick() {

                    var averageInterval = clock.getAverageInterval();

                    if (averageInterval > thresholdTime + 0.025) {
                        decreaseParticleAmountWith(64);
                    
                    } else if (averageInterval > thresholdTime + 0.005) {
                        decreaseParticleAmountWith(16);
                
                    } else if (averageInterval > thresholdTime + 0.0005) {
                        decreaseParticleAmountWith(4);
                
                    } else if (averageInterval > thresholdTime + 0.00025) {
                        decreaseParticleAmountWith(1);

                    } else if (averageInterval < thresholdTime - 0.025) {
                        increaseParticleAmountWith(64);

                    } else if (averageInterval < thresholdTime - 0.005) {
                        increaseParticleAmountWith(16);

                    } else if (averageInterval < thresholdTime - 0.0005) {
                        increaseParticleAmountWith(4);

                    } else if (averageInterval < thresholdTime - 0.00025) {
                        increaseParticleAmountWith(1);
                        
                    } else {
                        var intervalCount = clock.getIntervalCount();
                        if (intervalCount > 180 && particleAmount > 0) {
                            callback(particleAmount, averageInterval, intervalCount, clock.getTimeElapsed());
                            return;
                        }
                    }
                    
                    requestAnimationFrame(tick);

                    cloud.update(clock.getTimeElapsed());

                    postProgram.render(function () {
                        cloudProgram.render(cloud);
                    });

                })();

                function decreaseParticleAmountWith(amount) {
                    particleAmount -= amount;
                    if (particleAmount < 0) {
                        particleAmount = 0;
                    }
                    cloud.setParticleAmount(particleAmount);
                }

				function increaseParticleAmountWith(amount) {
                    particleAmount += amount;
                    
                    if (particleAmount > particleMax) {
                    	particleMax *= 2;
                    	cloud = new Cloud.Cloud(particleAmount, particleMax);

                    } else {
                    	cloud.setParticleAmount(particleAmount);
                    }
				}

            };

            /**
             * @param {number} n - The amount of frame buffer textures. Has to be between 1 and 8.
             */
            this.setFBOTextureN = function (n) {
                postProgram.setFBOTextureN(n);
            };

            /**
             * @param {number} n - The amount of cloud vertex buffer objects. Has to be between 1 and 8.
             */
            this.setVBON = function (n) {
                cloudProgram.setVBON(n);
            };
		}
	
		return {
            Benchmarker: Benchmarker
		};
	});
