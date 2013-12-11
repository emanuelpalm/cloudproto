require.config({
    baseUrl: "js"
});

require(["webgl", "analyzer", "benchmark", "terminal"], function (WebGL, Analyzer, Benchmark, Terminal) {

    var terminal = new Terminal.Terminal(document.getElementById("terminal"), 16);
    var startButton = document.getElementById("startButton");
    var frameTimeReports = [];
    var relativePerformanceReports = [];

    var STATIC_BENCHMARK_TIME = 20.0;
    var staticBenchmarkParticleAmount = 0;

    terminal.addRow("Initializing WebGL ..................");

	var gl = initializeWebGL();

    terminal.setTop("Initializing WebGL .................. done!");
    terminal.addRow("Initializing benchmarker ............");

    var benchmarker = new Benchmark.Benchmarker(gl);

    terminal.setTop("Initializing benchmarker ............ done!");
    terminal.addRow("Press START to start the Cloud Benchmark Suite.");

    startButton.style.visibility = "visible";
    startButton.onmousedown = function () {
        startButton.parentNode.removeChild(startButton);

        benchmark0();
    };

    function benchmark0() {
        terminal.addRow("Running cloud calibration ...........");
        benchmarker.setVBON(1);
        benchmarker.setFBOTextureN(1);
        benchmarker.runCalibrating(benchmark0done, 0.10, 1024);
    }

    function benchmark0done(particleAmount, time) {
        terminal.setTop("Running cloud calibration ........... done!");
        terminal.addRow("Calibration took " + time.toFixed(2) + " seconds.");
        terminal.addRow("Calibration converged at " + particleAmount + " cloud particles.");
        relativePerformanceReports.push(particleAmount);

        staticBenchmarkParticleAmount = particleAmount;
        benchmark1();
    }

    function benchmark1() {
        terminal.addRow("Running frame time test {V=1 F=1} ... ");
        benchmarker.setVBON(1);
        benchmarker.setFBOTextureN(1);
        benchmarker.runStatic(benchmark1done, STATIC_BENCHMARK_TIME, staticBenchmarkParticleAmount);
    }

    function benchmark1done(report) {
        terminal.setTop("Running frame time test {V=1 F=1} ... done!");
        terminal.addRow("Frame time average was " + report.average.toFixed(4) + ".");
        terminal.addRow("Frame time standard deviation was " + report.standardDeviation.toFixed(4) + ".");
        frameTimeReports.push(report);

        benchmark2();
    }

    function benchmark2() {
        terminal.addRow("Running frame time test {V=2 F=1} ... ");
        benchmarker.setVBON(2);
        benchmarker.setFBOTextureN(1);
        benchmarker.runStatic(benchmark2done, STATIC_BENCHMARK_TIME, staticBenchmarkParticleAmount);
    }

    function benchmark2done(report) {
        terminal.setTop("Running frame time test {V=2 F=1} ... done!");
        terminal.addRow("Frame time average was " + report.average.toFixed(4) + ".");
        terminal.addRow("Frame time standard deviation was " + report.standardDeviation.toFixed(4) + ".");
        frameTimeReports.push(report);

        benchmark3();
    }

    function benchmark3() {
        terminal.addRow("Running frame time test {V=1 F=2} ... ");
        benchmarker.setVBON(1);
        benchmarker.setFBOTextureN(2);
        benchmarker.runStatic(benchmark3done, STATIC_BENCHMARK_TIME, staticBenchmarkParticleAmount);
    }

    function benchmark3done(report) {
        terminal.setTop("Running frame time test {V=1 F=2} ... done!");
        terminal.addRow("Frame time average was " + report.average.toFixed(4) + ".");
        terminal.addRow("Frame time standard deviation was " + report.standardDeviation.toFixed(4) + ".");
        frameTimeReports.push(report);

        benchmark4();
    }

    function benchmark4() {
        terminal.addRow("Running frame time test {V=2 F=2} ... ");
        benchmarker.setVBON(2);
        benchmarker.setFBOTextureN(2);
        benchmarker.runStatic(benchmark4done, STATIC_BENCHMARK_TIME, staticBenchmarkParticleAmount);
    }

    function benchmark4done(report) {
        terminal.setTop("Running frame time test {V=2 F=2} ... done!");
        terminal.addRow("Frame time average was " + report.average.toFixed(4) + ".");
        terminal.addRow("Frame time standard deviation was " + report.standardDeviation.toFixed(4) + ".");
        frameTimeReports.push(report);

        benchmarkEnd();
    }

	function benchmarkEnd() {
        terminal.addRow("All benchmarks successfully performed.");
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