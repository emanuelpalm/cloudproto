require.config({
    baseUrl: "js"
});

require(["webgl", "analyzer", "benchmark", "terminal"], function (WebGL, Analyzer, Benchmark, Console) {

    var terminal = new Console.Terminal(document.getElementById("terminal"), 8);
    var startButton = document.getElementById("startButton");
    var frameTimeReports = [];
    var relativePerformanceReports = [];

    terminal.addRow("Initializing WebGL ..............");

	var gl = initializeWebGL();

    terminal.setRow(0, "Initializing WebGL .............. done!");
    terminal.addRow("Initializing benchmarker ........");

    var benchmarker = new Benchmark.Benchmarker(gl);

    terminal.setRow(0, "Initializing benchmarker ........ done!");
    terminal.addRow("Press START to start the Cloud Benchmark Suite.");

    startButton.style.visibility = "visible";
    startButton.onmousedown = function () {
        startButton.parentNode.removeChild(startButton);

        terminal.addRow("Running cloud calibration .......");
        benchmarker.runCalibrating(benchmarkEnd, 0.05, 1024);
    };

	function benchmarkEnd(amt, time) {
        terminal.setRow(0, "Running cloud calibration ....... done!");

        relativePerformanceReports.push(amt);
        terminal.addRow("Calibration took " + time.toFixed(2) + " seconds.");
        terminal.addRow("Calibration converged at " + amt + " cloud particles.");
	}

	function initializeWebGL() {
		var canvas = document.getElementById("webgl-canvas");
		var gl = WebGL.getContextFrom(canvas);

		canvas.width = canvas.clientWidth;
		canvas.height = canvas.clientHeight;
		gl.viewport(0, 0, canvas.width, canvas.height);

		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		
		return gl;
	}
});