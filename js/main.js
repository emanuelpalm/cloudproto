require.config({
    baseUrl: "js"
});

require(["webgl", "analyzer", "benchmark", "terminal"], function (WebGL, Analyzer, Benchmark, Terminal) {
	
	try {
		var terminal = new Terminal.Terminal(document.getElementById("terminal"), 8);
		var startButton = document.getElementById("startButton");
		
		var CALIBRATING_BENCHMARK_THRESHOLD_TIME = 0.05;
		var CALIBRATING_BENCHMARK_STEP_SIZE = 8;
		var STATIC_BENCHMARK_TIME = 300.0;
		var staticBenchmarkParticleAmount = 0;
		
		var reports = {
			global: {
				userAgent: navigator.userAgent,
				calibratingBenchmarkThresholdTime: CALIBRATING_BENCHMARK_THRESHOLD_TIME,
				calibratingBenchmarkStepSize: CALIBRATING_BENCHMARK_STEP_SIZE,
				staticbenchmarkTime: STATIC_BENCHMARK_TIME
			}
		};
		
		var settings = [
			{ name: "RPI_V1_F1", v: 1, f: 1, next: benchmarkStatic },
			{ name: "FRT_V1_F1", v: 1, f: 1, next: benchmarkStatic },
			{ name: "FRT_V2_F1", v: 2, f: 1, next: benchmarkStatic },
			{ name: "FRT_V1_F2", v: 1, f: 2, next: benchmarkStatic },
			{ name: "FRT_V2_F2", v: 2, f: 2, next: benchmarkCalibrating },
			{ name: "RPI_V2_F1", v: 2, f: 1, next: benchmarkCalibrating },
			{ name: "RPI_V1_F2", v: 1, f: 2, next: benchmarkCalibrating },
			{ name: "RPI_V2_F2", v: 2, f: 2, next: benchmarkEnd }
		];

		terminal.addRow("Initializing WebGL ............................");

		var gl = initializeWebGL();

		terminal.appendToTop(" done!");
		terminal.addRow("Initializing benchmarker ......................");

		var benchmarker = new Benchmark.Benchmarker(gl);

		terminal.appendToTop(" done!");
		terminal.addRow("Press START to start the Cloud Benchmark Suite.");

		startButton.style.visibility = "visible";
		startButton.onmousedown = function () {
		    startButton.parentNode.removeChild(startButton);

			terminal.addRow("Starting Cloud benchmark suite. This may take a while ...");
		    benchmarkCalibrating(reports, settings);
		};
	} catch (e) {
		alert("Unrecoverable error: " + e);
	}
	
	function benchmarkStatic(reports, settings) {
		var setting = settings.shift();
		
        terminal.addRow("Running frame time test {V=" + setting.v + " F=" + setting.f + "} ............. ");
        benchmarker.setVBON(setting.v);
        benchmarker.setFBOTextureN(setting.f);
        benchmarker.runStatic(
        	STATIC_BENCHMARK_TIME,
        	staticBenchmarkParticleAmount,
        	function (report) {

        		terminal.appendToTop(" done!");
        		terminal.addRow("Results: {AVG=" + report.average.toFixed(4)
        			+ " STDEV=" + report.standardDeviation.toFixed(4) + "}.");

		    	reports[setting.name] = report;
		    	setting.next(reports, settings);
		    });
	}
	
	function benchmarkCalibrating(reports, settings) {
		var setting = settings.shift();
		
        terminal.addRow("Running relative performance test {V=" + setting.v + " F=" + setting.f + "} ... ");
        benchmarker.setVBON(setting.v);
        benchmarker.setFBOTextureN(setting.f);
        benchmarker.runCalibrating(
        	CALIBRATING_BENCHMARK_THRESHOLD_TIME,
        	CALIBRATING_BENCHMARK_STEP_SIZE,
        	function (particleAmount, timeElapsed) {
        	
        		staticBenchmarkParticleAmount = particleAmount;
        		
        		terminal.appendToTop(" done!");
        		terminal.addRow("Results: {PARTICLES=" + particleAmount
        			+ " TIME=" + timeElapsed.toFixed(2) + "}.");

		    	reports[setting.name] = { particleAmount: particleAmount, timeElapsed: timeElapsed };
		    	setting.next(reports, settings);
		    });
	}
	
	function benchmarkEnd(reports, settings) {
        terminal.addRow("All benchmarks successfully performed.");
        document.getElementById("resultBox").innerHTML = JSON.stringify(reports);
        console.log(reports);
	}

	function initializeWebGL() {
		var canvas = document.getElementById("webgl-canvas");
		var gl = WebGL.getContextFrom(canvas);

		canvas.width = canvas.clientWidth;
		canvas.height = canvas.clientHeight;
		gl.viewport(0, 0, canvas.width, canvas.height);

		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
		
		return gl;
	}
});
