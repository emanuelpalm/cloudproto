define(["webgl", "utilities", "cloud", "analyzer", "programs"],
	function (WebGL, Utilities, Cloud, Analyzer, Programs) {

        /**
         * Creates a new benchmark program.
         *
         * @param {WebGLObject} gl - WebGL context.
         * @constructor
         */
		function Benchmarker(gl) {
		
			var cloudProgram = new Programs.Cloud(gl,
				Utilities.GET("resources/particle.vert"),
				Utilities.GET("resources/particle.frag")
			);

			var postProgram = new Programs.Post(gl,
				Utilities.GET("resources/post.vert"),
				Utilities.GET("resources/post.frag")
			);

            var particleMax = 4194304;
			var cloud = new Cloud.Cloud(16, particleMax);

            /**
             * Run benchmark.
             *
             * @param {function} callback - Callback to fire with AnalyzerReport when benchmark is over.
             * @param {number} runTime - Time, in seconds, to run benchmark.
             * @param {number} particleAmount - Amount of particles in cloud during benchmark.
             */
			this.runStatic = function (callback, runTime, particleAmount) {

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
             * @param {function} callback - Callback fired with particle amount and time elapsed on convergence.
             * @param {number} thresholdTime - Frame rendering time, in seconds, to converge at.
             * @param {number} stepSize - The amount of particles added each time the threshold is not reached.
             */
            this.runCalibrating = function (callback, thresholdTime, stepSize) {

                var clock = new Utilities.Clock();
                cloud.setParticleAmount(stepSize);

                var particleAmount = 0;
                var thresholdStreak = 0;

                (function tick() {

                    if (clock.getInterval() > thresholdTime) {
                        thresholdStreak++;

                    } else {
                        particleAmount += stepSize;
                        cloud.setParticleAmount(particleAmount);
                        thresholdStreak = 0;
                    }

                    if (thresholdStreak >= 4) {
                        callback(particleAmount, clock.getTimeElapsed());

                    } else {
                        requestAnimationFrame(tick);

                        cloud.update(clock.getTimeElapsed());

                        postProgram.render(function () {
                            cloudProgram.render(cloud);
                        });
                    }

                })();

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
