define(function(require) {
    QUnit.module("Console");
    var Console = require("console");

    QUnit.test("Adding rows to console", function (assert) {

        var console = new Console.Console(document.getElementById("test-console"), 2);

        assert.equal(console.rowAmount, 0, "Console has 0 rows of text.");

        console.addRow("1");
        assert.equal(console.rowAmount, 1, "Console has 1 rows of text.");
        assert.equal(console.getRow(0), "1", "Row 0 contains the text '1'.");


        console.addRow("2");
        assert.equal(console.rowAmount, 2, "Console has 2 rows of text.");
        assert.equal(console.getRow(0), "2", "Row 0 contains the text '2'.");
        assert.equal(console.getRow(1), "1", "Row 1 contains the text '1'.");

        console.addRow("3");
        assert.equal(console.rowAmount, 2, "Console still has 2 rows of text.");
        assert.equal(console.getRow(0), "3", "Row 0 contains the text '3'.");
        assert.equal(console.getRow(1), "2", "Row 1 contains the text '2'.");
    });

    QUnit.test("Getting and setting rows in console", function (assert) {

        var console = new Console.Console(document.getElementById("test-console"), 2);

        console.addRow("A");
        console.addRow("B");
        assert.equal(console.getRow(0), "B", "Row 0 contains the text 'B'.");
        assert.equal(console.getRow(1), "A", "Row 1 contains the text 'A'.");

        console.setRow(0, "X");
        assert.equal(console.getRow(0), "X", "Row 0 contains the text 'X'.");
        assert.equal(console.getRow(1), "A", "Row 1 contains the text 'A'.");

        console.setRow(1, "Y");
        assert.equal(console.getRow(0), "X", "Row 0 contains the text 'X'.");
        assert.equal(console.getRow(1), "Y", "Row 1 contains the text 'Y'.");
    });
});