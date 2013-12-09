require.config({
    baseUrl: "js"
});

require(["webgl", "utilities", "cloud", "analyzer"], function (WebGL, Utilities, Cloud, Analyzer) {
    var canvas = document.getElementById("webgl-canvas");
    var gl = WebGL.getContextFrom(canvas);

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);

    var particleProgram = WebGL.createProgramFrom(gl,
        Utilities.GET("resources/shader.vert"),
        Utilities.GET("resources/shader.frag")
    );
    gl.useProgram(particleProgram);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    var textureSize = WebGL.getValidTextureSizeFrom(gl, canvas);
    var fboBuffer = new WebGL.FBOBuffer(gl, 2, textureSize);

    var vboBuffer = new WebGL.VBOBuffer(gl, 1, [
        new WebGL.VertexAttribute(gl.getAttribLocation(particleProgram, "a_Position"), 4),
        new WebGL.VertexAttribute(gl.getAttribLocation(particleProgram, "a_Color"), 4)
    ]);

    var particleAmount = 256;
    var presenter = document.getElementById("presenter");

    var cloud = new Cloud.Cloud(particleAmount, particleAmount);
    var analyzer = new Analyzer.Analyzer();

    var clock = new Utilities.Clock();
    var updateRate = 0, time = 0;
    (function tick() {
        time = clock.getTimeElapsed();
        if (time <= 10.0) {
            requestAnimationFrame(tick);

            cloud.update(time);
            vboBuffer.upload(cloud.getData());

            vboBuffer.enable();
            //fboBuffer.startCapture();
            gl.drawArrays(gl.POINTS, 0, particleAmount);
            //fboBuffer.stopCapture();
            vboBuffer.disable();

            analyzer.push(clock.getInterval());
        } else {
            var report = analyzer.generateReport();
            presenter.innerHTML = "<p><b>Avg:</b> " + report.average + "</p><p><b>Stdev:</b> " + report.standardDeviation + "</p>";
        }
    })();

    /*var reports = benchmarkCloudsIn(canvas);

    // TODO: Do something more intuitive with the generated dataView.
    document.getElementById("presenter").innerHTML = JSON.stringify(reports);

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

        // Perform pre-calibrated analysis, which is more relevant for measuring frame rendering times.
        spec.calibration.isEnabled = false;
        var particleAmount = Math.round(unbufferedReport.rpi.average);
        var precalibratedReports = {
            fbo:         benchmark(new FBOCloud(particleAmount)),
            vbo:         benchmark(new VBOCloud(particleAmount)),
            fvbo:        benchmark(new FVBOCloud(particleAmount))
        }

        return { calibrated: calibratedReports, precalibrated: precalibratedReports };
    }*/
});