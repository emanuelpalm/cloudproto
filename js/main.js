require.config({
    baseUrl: "js"
});

require(["webgl", "analyzer", "benchmark"], function (WebGL, Analyzer, Benchmark) {

	var gl = initializeWebGL();
	var reports = [];

    var benchmarker = new Benchmark.Benchmarker(gl, 10.0);
    benchmarker.run(benchmarkEnd);
	
	function benchmarkEnd(report) {
		reports.push(report);
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
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		
		return gl;
	}
});
