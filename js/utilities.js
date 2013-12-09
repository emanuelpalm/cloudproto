define([], function () {
    /**
     * Synchronously GET file at given URL.
     *
     * @param {string} url - URL of file to GET.
     * @returns {string} Received data.
     */
    function GET(url) {
        var request = new XMLHttpRequest();

        request.open("GET", url, false);
        request.send();

        if (request.status != 200)
            throw "Unable to retrieve '" + url + "'.";

        return request.responseText;
    }

    /**
     * Measures time and intervals.
     *
     * @constructor
     * @param {function} [t=performance.now] - Function for acquiring current time, in ms.
     */
    function Clock(t) {
        if (!t)
            t = function () { return performance.now(); };

        var timeStart = t();
        var timeNow = 0;
        var timeInterval = 0;
        var timeLast = t();

        /**
         * Acquire time elapsed, in seconds, since last call of this method.
         *
         * The first time the method is called, it returns the time since the Clock was
         * instantiated.
         *
         * @returns {number} Interval time in seconds.
         */
        this.getInterval = function () {

            timeNow = t();
            timeInterval = timeNow - timeLast;
            timeLast = timeNow;

            return timeInterval / 1000;
        }

        /**
         * @returns {number} Time, in seconds, since the Clock was instantiated.
         */
        this.getTimeElapsed = function () {
            return (t() - timeStart) / 1000;
        }
    }

    // Ensure performance.now() is a valid function.
    window.performance = window.performance || {};
    performance.now = (function () {
        return performance.now ||
            performance.webkitNow ||
            performance.mozNow ||
            performance.msNow ||
            performance.oNow ||
            function () {
                return new Date().getTime();
            };
    })();

    // Ensure requestAnimationFrame() is a valid function.
    window.requestAnimationFrame = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    // Ensure cancelAnimationFrame() is a valid function.
    window.cancelAnimationFrame = (function () {
        return window.cancelRequestAnimationFrame ||
            window.webkitCancelAnimationFrame || window.webkitCancelRequestAnimationFrame ||
            window.mozCancelAnimationFrame || window.mozCancelRequestAnimationFrame ||
            window.msCancelAnimationFrame || window.msCancelRequestAnimationFrame ||
            window.oCancelAnimationFrame || window.oCancelRequestAnimationFrame ||
            window.clearTimeout;
    });

    return {
        GET: GET,
        Clock: Clock
    };
});
