define([], function () {

    /**
     * Creates a simple HTML terminal width a given amount of rows.
     *
     * The given HTML element, which houses the terminal, is populated with DIVs as content is added to the terminal.
     *
     * @param {HTMLElement} container - HTML element housing the terminal.
     * @param {number} rowMax - Max amount of rows in presenter.
     * @constructor
     */
    function Terminal(container, rowMax) {
        this.container = container;
        this.rowMax = rowMax;
        this.rowAmount = 0;
    }

    /**
     * @param {string} text - Text to add at top of terminal.
     */
    Terminal.prototype.addRow = function (text) {

        var element = createElementWith(text);
        insertElementIntoContainer(element, this.container);
        handleRowsIn(this);

        function createElementWith(text) {
            var element = document.createElement("div");
            element.innerHTML = text;

            return element;
        }

        function insertElementIntoContainer(element, container) {
            container.insertBefore(element, container.firstChild);
        }

        function handleRowsIn(terminal) {
            (terminal.rowAmount >= terminal.rowMax)
                ? removeFirstChildFrom(terminal.container)
                : terminal.rowAmount++;

            function removeFirstChildFrom(element) {
                element.removeChild(element.childNodes[element.childElementCount - 1]);
            }
        }
    };

    /**
     * @param {number} index - Index of row to get.
     * @returns {string} Text in acquired row.
     */
    Terminal.prototype.getRow = function (index) {
        if (index < 0 || index >= this.rowAmount)
            throw "Terminal index " + index + " out of range.";

        return this.container.childNodes[index].innerHTML;
    };

    /**
     * @param {number} index - Index of row to set.
     * @param {string} text - Text to set.
     */
    Terminal.prototype.setRow = function (index, text) {
        if (index < 0 || index >= this.rowAmount)
            throw "Terminal index " + index + " out of range.";

        this.container.childNodes[index].innerHTML = text;
    }

    return {
        Terminal: Terminal
    };
});