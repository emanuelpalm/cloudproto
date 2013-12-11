require.config({
    baseUrl: "js"
});

require(["webgl", "analyzer", "benchmark", "console"], function (WebGL, Analyzer, Benchmark, Console) {

    var console = new Console.Console(document.getElementById("console"), 8);
    var startButton = document.getElementById("startButton");
    var frameTimeReports = [];
    var relativePerformanceReports = [];

    console.addRow("Initializing WebGL ..............");

	var gl = initializeWebGL();

    console.setRow(0, "Initializing WebGL .............. done!");
    console.addRow("Initializing benchmarker ........");

    var benchmarker = new Benchmark.Benchmarker(gl);

    console.setRow(0, "Initializing benchmarker ........ done!");
    console.addRow("Press START to start the Cloud Benchmark Suite.");

    startButton.style.visibility = "visible";
    startButton.onmousedown = function () {
        startButton.parentNode.removeChild(startButton);

        console.addRow("Running cloud calibration .......");
        benchmarker.runCalibrating(benchmarkEnd, 0.05, 1024);
    };

	function benchmarkEnd(amt, time) {
        console.setRow(0, "Running cloud calibration ....... done!");

        relativePerformanceReports.push(amt);
        console.addRow("Calibration took " + time.toFixed(2) + " seconds.");
        console.addRow("Calibration converged at " + amt + " cloud particles.");
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