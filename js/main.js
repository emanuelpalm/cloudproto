require.config({
    baseUrl: "js"
});

require(["webgl", "analyzer", "benchmark", "terminal"], function (WebGL, Analyzer, Benchmark, Terminal) {
	
	try {
		var terminal = new Terminal.Terminal(document.getElementById("terminal"), 8);
		var startButton = document.getElementById("startButton");
		
		var programForm = document.getElementById("programForm");
		var programButton = document.getElementById("programButton");
		
		var conf = {
			programIdentifier: "cheap",
			calibratingBenchmarkThresholdTime: 0.05,
			calibratingBenchmarkStepSize: 8,
			staticBenchmarkTime: 300.0,
			staticBenchmarkParticleAmount: 0
		}
		
		var reports = {};
		
		var schedule = [
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
		var benchmarker;

		terminal.appendToTop(" done!");
		terminal.addRow("Please specify your desired configuration.");
		
		programForm.style.visibility = "visible";
		programButton.onmousedown = function () {
			programForm.style.visibility = "hidden";
			
			setTimeout(function () {
				collectConfigurationDataFrom(document.forms.programForm);
				programForm.parentNode.removeChild(programForm);
		
				terminal.addRow("Configuration registered.");
				terminal.addRow("Initializing benchmarker ......................");
				
				setTimeout(function () {
					benchmarker = new Benchmark.Benchmarker(gl, conf.programIdentifier);

					terminal.appendToTop(" done!");
					terminal.addRow("Press START to start the Cloud Benchmark Suite.");

					startButton.style.visibility = "visible";
					startButton.onmousedown = function () {
						startButton.parentNode.removeChild(startButton);

						terminal.addRow("Starting Cloud benchmark suite. This may take a while ...");
						benchmarkCalibrating(reports, schedule);
					};
				}, 250);
				
				function collectConfigurationDataFrom(form) {
					conf.programIdentifier = form.programToRun.value;
					conf.calibratingBenchmarkThresholdTime = parseFloat(form.calibratingBenchmarkThresholdTime.value);
					conf.calibratingBenchmarkStepSize = parseInt(form.calibratingBenchmarkStepSize.value);
					conf.staticBenchmarkTime = parseFloat(form.staticBenchmarkTime.value);
				}
			}, 250);

		};
	} catch (e) {
		alert("Unrecoverable error: " + e);
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
	
	function benchmarkStatic(reports, schedule) {
		var s = schedule.shift();
		
        terminal.addRow("Running frame time test {V=" + s.v + " F=" + s.f + "} ............. ");
        benchmarker.setVBON(s.v);
        benchmarker.setFBOTextureN(s.f);
        benchmarker.runStatic(
        	conf.staticBenchmarkTime,
        	conf.staticBenchmarkParticleAmount,
        	function (report) {

        		terminal.appendToTop(" done!");
        		terminal.addRow("Results: {AVG=" + report.average.toFixed(4) + " STDEV=" + report.standardDeviation.toFixed(4) + "}.");

		    	reports[s.name] = report;
		    	s.next(reports, schedule);
		    });
	}
	
	function benchmarkCalibrating(reports, schedule) {
		var s = schedule.shift();
		
        terminal.addRow("Running relative performance test {V=" + s.v + " F=" + s.f + "} ... ");
        benchmarker.setVBON(s.v);
        benchmarker.setFBOTextureN(s.f);
        benchmarker.runCalibrating(
        	conf.calibratingBenchmarkThresholdTime,
        	conf.calibratingBenchmarkStepSize,
        	function (particleAmount, timeElapsed) {
        	
        		conf.staticBenchmarkParticleAmount = particleAmount;
        		
        		terminal.appendToTop(" done!");
        		terminal.addRow("Results: {PARTICLES=" + particleAmount + " TIME=" + timeElapsed.toFixed(2) + "}.");

		    	reports[s.name] = { particleAmount: particleAmount, timeElapsed: timeElapsed };
		    	s.next(reports, schedule);
		    });
	}
	
	function benchmarkEnd(reports, schedule) {
        terminal.addRow("All benchmarks successfully performed.");
        logResults(reports);
	}

	function logResults(reports) {
        reports.global = {
			userAgent: navigator.userAgent,
			calibratingBenchmarkThresholdTime: conf.calibratingBenchmarkThresholdTime,
			calibratingBenchmarkStepSize: conf.calibratingBenchmarkStepSize,
			staticbenchmarkTime: conf.staticBenchmarkTime
		};
        document.getElementById("resultBox").innerHTML = JSON.stringify(reports);
	}
});
