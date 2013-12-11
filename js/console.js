define([], function () {

    /**
     * Creates a simple HTML console width a given amount of rows.
     *
     * The given HTML element, which houses the console, is populated with DIVs as content is added to the console.
     *
     * @param {HTMLElement} container - HTML element housing the console.
     * @param {number} rowMax - Max amount of rows in presenter.
     * @constructor
     */
    function Console(container, rowMax) {
        this.container = container;
        this.rowMax = rowMax;
        this.rowAmount = 0;
    }

    /**
     * @param {string} text - Text to add at top of console.
     */
    Console.prototype.addRow = function (text) {

        var element = createElementWith(text);
        insertElementIntoContainer(element, this.container);
        handleConsoleRowsIn(this);

        function createElementWith(text) {
            var element = document.createElement("div");
            element.innerHTML = text;

            return element;
        }

        function insertElementIntoContainer(element, container) {
            container.insertBefore(element, container.firstChild);
        }

        function handleConsoleRowsIn(console) {
            (console.rowAmount >= console.rowMax)
                ? removeFirstChildFrom(console.container)
                : console.rowAmount++;

            function removeFirstChildFrom(element) {
                element.removeChild(element.childNodes[element.childElementCount - 1]);
            }
        }
    };

    /**
     * @param {number} index - Index of row to get.
     * @returns {string} Text in acquired row.
     */
    Console.prototype.getRow = function (index) {
        if (index < 0 || index >= this.rowAmount)
            throw "Console index " + index + " out of range.";

        return this.container.childNodes[index].innerHTML;
    };

    /**
     * @param {number} index - Index of row to set.
     * @param {string} text - Text to set.
     */
    Console.prototype.setRow = function (index, text) {
        if (index < 0 || index >= this.rowAmount)
            throw "Console index " + index + " out of range.";

        this.container.childNodes[index].innerHTML = text;
    }

    return {
        Console: Console
    };
});