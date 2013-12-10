require.config({
    baseUrl: "js"
});

require(["webgl", "analyzer", "benchmark"], function (WebGL, Analyzer, Benchmark) {

	var gl = initializeWebGL();
	var reports = [];
	benchmark1();
	
	function benchmark1() {
		var suite = new Benchmark.Suite(gl, {
			vertexBufferAmount: 1,
			fragmentTextureAmount: 1,
			particleAmount: 65536,
			time: 60.0
		});
		
		suite.run(benchmark2);
	}
	
	function benchmark2(report) {
		reports.push(report);
	
		var suite = new Benchmark.Suite(gl, {
			vertexBufferAmount: 2,
			fragmentTextureAmount: 1,
			particleAmount: 65536,
			time: 60.0
		});
		
		suite.run(benchmark3);
	}
	
	function benchmark3(report) {
		reports.push(report);
		
		var suite = new Benchmark.Suite(gl, {
			vertexBufferAmount: 1,
			fragmentTextureAmount: 1,
			particleAmount: 65536,
			time: 60.0
		});
		
		suite.run(benchmark4);
	}
	
	function benchmark4(report) {
		reports.push(report);
		
		var suite = new Benchmark.Suite(gl, {
			vertexBufferAmount: 1,
			fragmentTextureAmount: 2,
			particleAmount: 65536,
			time: 60.0
		});
		
		suite.run(benchmarkEnd);
	}
	
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
