/**
 * Application main function.
 *
 * @param {HTMLCanvasElement} canvas - The canvas element in which to render graphics.
 * @param {HTMLElement} presenter - The HTML element in which to present the analysis results.
 */
function cloudproto(canvas, presenter) {
	
	var reports = benchmarkCloudsIn(canvas);
	
	// TODO: Do something more intuitive with the generated data.
	presenter.innerHTML = JSON.stringify(reports);
	
	function benchmarkCloudsIn(canvas) {
		var spec = {
			timeoutInSeconds: 10.0,
			calibration: {
				isEnabled: true,
				desiredFrameTimeInSeconds: 0.050 // 20 frames per second.
			}
		};
	
		var benchmark = function(cloud) {
			var benchmarker = new CloudBenchmarker(canvas, cloud, spec);
			benchmarker.run();
		
			return benchmarker.getReport();
		}
	
		// Perform calibrated analysis, which is relevant for measuring relative performance indices.
		var unbufferedReport = benchmark(new Cloud(), spec);
		var calibratedReports = {
			unbuffered:  unbufferedAnalysis,
			fbo:         benchmark(new FBOCloud()),
			vbo:         benchmark(new VBOCloud()),
			fvbo:        benchmark(new FVBOCloud())
		};
	
		// Perform precalibrated analysis, which is more relevant for measuring frame rendering times.
		spec.calibration.isEnabled = false;
		var particleAmount = Math.round(unbufferedReport.rpi.average);
		var precalibratedReports = {
			fbo:         benchmark(new FBOCloud(particleAmount)),
			vbo:         benchmark(new VBOCloud(particleAmount)),
			fvbo:        benchmark(new FVBOCloud(particleAmount))
		}
		
		return { calibrated: calibratedReports, precalibrated: precalibratedReports };
	} 
}