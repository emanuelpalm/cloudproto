define(function (require) {
    QUnit.module("Utilities");
    var Utilities = require("utilities");

    QUnit.test("GET file", function (assert) {
        var fileContents = Utilities.GET("resources/hello.txt");
        var correctContents = "Hello world!";
        assert.equal(fileContents, correctContents, "Acquired contents from 'resources/hello.txt' are '" + correctContents + "'.");
    });

    QUnit.test("Measure time with Clock", function (assert) {

        var time = 0;

        function mockTimeFunction() {
            return time;
        }

        var clock = new Utilities.Clock(mockTimeFunction);

        assert.equal(clock.getTimeElapsed(), 0.0, "0.0 seconds elapsed since clock was created.");

        time += 1000;
        assert.equal(clock.getInterval(), 1.0, "1.0 seconds elapsed since last measured interval.");
        time += 500;
        assert.equal(clock.getInterval(), 0.5, "0.5 seconds elapsed since last measured interval.");
        time += 2500;
        assert.equal(clock.getInterval(), 2.5, "2.5 seconds elapsed since last measured interval.");

        assert.equal(clock.getTimeElapsed(), 4.0, "4.0 seconds elapsed since clock was created.");
    });
    
    QUnit.test("Collect sampled average intervals with AverageIntervalClock", function (assert) {

        var time = 0;

        function mockTimeFunction() {
            return time;
        }
        
        var clock = new Utilities.AverageIntervalClock(2, mockTimeFunction);
        
        assert.equal(clock.getTimeElapsed(), 0.0, "0.0 seconds elapsed since 2 sample clock was created.");
        assert.equal(clock.getIntervalCount(), 0, "0 intervals have been measured.");
        
        time += 1000;
        assert.equal(clock.getAverageInterval(), 1.00, "Average interval of sample [1.0] is 1.00.");
        assert.equal(clock.getIntervalCount(), 1, "1 interval has been measured.");
        time += 500;
        assert.equal(clock.getAverageInterval(), 0.75, "Average interval of samples [1.0, 0.5] is 0.75.");
        assert.equal(clock.getIntervalCount(), 2, "2 intervals have been measured.");
        time += 2500;
        assert.equal(clock.getAverageInterval(), 1.50, "Average interval of samples [0.5, 2.5] is 1.50.");
        assert.equal(clock.getIntervalCount(), 3, "3 intervals have been measured.");
        
        assert.equal(clock.getTimeElapsed(), 4.0, "4.0 seconds elapsed since clock was created.");
        
    });

    QUnit.test("Look for performance.now()", function (assert) {
        assert.ok(performance.now, "performance.now exists.");
        assert.ok(performance.now(), "performance.now() is callable.");
    });

    QUnit.test("Look for requestAnimationFrame()", function (assert) {
        assert.ok(requestAnimationFrame, "requestAnimationFrame exists.");
        assert.ok(requestAnimationFrame(function () {
        }), "requestAnimationFrame() is callable.");
    });

    QUnit.test("Look for cancelAnimationFrame()", function (assert) {
        assert.ok(cancelAnimationFrame, "cancelAnimationFrame exists.");
        assert.ok(cancelAnimationFrame(), "cancelAnimationFrame() is callable.");
    });
});
