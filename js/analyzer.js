define([], function () {
    /**
     * Numerical analyzer.
     *
     * Collects numbers which may be used to generate a simple statistical reports.
     *
     * @constructor
     */
    function Analyzer() {
        this.items = [];
    }

    /**
     * Push new item unto analyzer.
     *
     * @param {number} item - Item to push.
     */
    Analyzer.prototype.push = function (item) {
        this.items.push(item);
    }

    /**
     * Reset analyzer.
     */
    Analyzer.prototype.reset = function () {
        this.items.length = 0;
    }

    /**
     * Generate a new report from items in analyzer.
     *
     * @returns {AnalyzerReport} Report with various details about the analyzed numbers.
     */
    Analyzer.prototype.generateReport = function () {
        var copiedItems = this.items.slice();
        return new AnalyzerReport(copiedItems);
    }

    /**
     * A report generated from the items collected from a numerical analyzer.
     *
     * @constructor
     * @param {number[]} items - Numerical values to generate report for.
     *
     * @property {number} samples - The amount of items accounted for.
     * @property {number} sum - The sum of all items.
     * @property {number} average - The average value of all items.
     * @property {number} standardDeviation - The standard deviation calculated from all items.
     */
    function AnalyzerReport(items) {
        this.samples = items.length;

        this.sum = (function (items) {
            return items.reduce(function (acc, elem) {
                return acc + elem;
            }, 0);
        })(items);

        this.average = (items.length)
            ? this.sum / items.length
            : 0.0;

        this.standardDeviation = (function (items, average) {
            if (items.length == 0)
                return 0.0;

            var deviations = items.map(function (a) {
                var diff = a - average;
                return diff * diff;
            });

            var sumOfDeviations = deviations.reduce(function (acc, elem) {
                return acc + elem;
            }, 0);

            return Math.sqrt(sumOfDeviations / items.length);
        })(items, this.average);
    }

    return {
        Analyzer: Analyzer,
        AnalyzerReport: AnalyzerReport
    };
});
