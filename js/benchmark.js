define(["webgl", "utilities", "cloud", "analyzer", "programs"],
	function (WebGL, Utilities, Cloud, Analyzer, Programs) {

        /**
         * Creates a new benchmark program.
         *
         * @param {WebGLObject} gl - WebGL context.
         * @param {number} runTime - Run-time, in seconds, of a single benchmark.
         * @constructor
         */
		function Benchmarker(gl, runTime) {
		
			var cloudProgram = new Programs.Cloud(gl,
				Utilities.GET("resources/particle.vert"),
				Utilities.GET("resources/particle.frag")
			);

			var postProgram = new Programs.Post(gl,
				Utilities.GET("resources/post.vert"),
				Utilities.GET("resources/post.frag")
			);

            var particleMax = 8388608;
			var cloud = new Cloud.Cloud(256, particleMax);
		
			var analyzer = new Analyzer.Analyzer();

            /**
             * Run benchmark.
             *
             * @param {function} callback - Callback to fire when benchmark is over.
             */
			this.run = function (callback) {

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
		}
	
		return {
            Benchmarker: Benchmarker
		};
	});
