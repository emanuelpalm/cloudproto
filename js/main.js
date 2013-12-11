require.config({
    baseUrl: "js"
});

require(["webgl", "analyzer", "benchmark"], function (WebGL, Analyzer, Benchmark) {

    var presenter = document.getElementById("presenter");
	var gl = initializeWebGL();
	var reports = [];

    presenter.innerHTML += "Initializing cloud ...";
    var benchmarker = new Benchmark.Benchmarker(gl);

    benchmarker.setVBON(2);
    benchmarker.setFBOTextureN(2);

    presenter.innerHTML += " done!<br />Running cloud calibration ...";
    benchmarker.runCalibrating(benchmarkEnd, 0.05, 1024);
    //benchmarker.runStatic(benchmarkEnd, 5.0, 1024);
	
	function benchmarkEnd(amt, time) {
        presenter.innerHTML += " done!<br />Calibration converged at " + amt + " particles.";
		console.log(amt);
        console.log(time);
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
