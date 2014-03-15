define(function (require) {
    QUnit.module("Analyzer");
    var Analyzer = require("analyzer");

    QUnit.test("Generate empty report", function (assert) {
        var analyzer = new Analyzer.Analyzer();

        var report = analyzer.generateReport();

        assert.equal(report.samples, 0, "Report - Contains no items.");
        assert.equal(report.sum, 0.0, "Report - Sum is 0.0.");
        assert.equal(report.average, 0.0, "Report - Average is 0.0.");
        assert.equal(report.standardDeviation, 0.0, "Report - Standard deviation is 0.0.");
    });

    QUnit.test("Generate two reports", function (assert) {
        var analyzer = new Analyzer.Analyzer();

        analyzer.push(1.0);
        analyzer.push(2.0);
        analyzer.push(3.0);

        var report1 = analyzer.generateReport();

        assert.equal(report1.samples, 3, "Report 1 - Contains 3 items.");
        assert.equal(report1.sum, 6.0, "Report 1 - Sum is 6.0.");
        assert.equal(report1.average, 2.0, "Report 1 - Average is 2.0.");
        assert.equal(report1.standardDeviation.toFixed(3), 0.816, "Report 1 - Standard deviation is ca 0.816.");

        analyzer.reset();
        analyzer.push(8.0);

        var report2 = analyzer.generateReport();

        assert.equal(report2.samples, 1, "Report 2 - Contains 1 item.");
        assert.equal(report2.sum, 8.0, "Report 2 - Sum is 8.0.");
        assert.equal(report2.average, 8.0, "Report 2 - Average is 8.0.");
        assert.equal(report2.standardDeviation, 0.0, "Report 2 - Standard deviation is exactly 0.0.");
    });
});
