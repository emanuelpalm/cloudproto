define(["webgl", "utilities", "cloud", "analyzer", "programs"],
	function (WebGL, Utilities, Cloud, Analyzer, Programs) {
		
		function Suite(gl, settings) {
		
			var cloudProgram = new Programs.Cloud(gl,
				Utilities.GET("resources/particle.vert"),
				Utilities.GET("resources/particle.frag"),
				settings.vertexBufferAmount
			);

			var textureSize = WebGL.getValidTextureSizeFrom(gl, gl.canvas);
			var postProgram = new Programs.Post(gl,
				Utilities.GET("resources/post.vert"),
				Utilities.GET("resources/post.frag"),
				textureSize,
				settings.vertexBufferAmount
			);
			var fboBuffer = new WebGL.FBOBuffer(gl, settings.fragmentTextureAmount, textureSize);

			var cloud = new Cloud.Cloud(settings.particleAmount, settings.particleAmount);
		
			var analyzer = new Analyzer.Analyzer();		
			this.run = function (callback) {
			
				var clock = new Utilities.Clock();
				var updateRate = 0, time = 0;
				
				(function tick() {
					time = clock.getTimeElapsed();
					
					if (time <= settings.time) {
						requestAnimationFrame(tick);

						cloud.update(time);
						
						fboBuffer.startCapture();
						cloudProgram.render(cloud);
						fboBuffer.stopCapture();
						
						postProgram.render(fboBuffer.getNextBuffer());

						analyzer.push(clock.getInterval());

					} else {
						callback(analyzer.generateReport());
					}
				})();

			};
		}
	
		return {
			Suite: Suite
		};
	});
