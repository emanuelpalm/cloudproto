define(function(require) {
    QUnit.module("Terminal");
    var Terminal = require("terminal");

    QUnit.test("Adding rows to terminal", function (assert) {

        var terminal = new Terminal.Terminal(document.getElementById("test-terminal"), 2);

        assert.equal(terminal.rowAmount, 0, "Terminal has 0 rows of text.");

        terminal.addRow("1");
        assert.equal(terminal.rowAmount, 1, "Terminal has 1 rows of text.");
        assert.equal(terminal.getRow(0), "1", "Row 0 contains the text '1'.");


        terminal.addRow("2");
        assert.equal(terminal.rowAmount, 2, "Terminal has 2 rows of text.");
        assert.equal(terminal.getRow(0), "2", "Row 0 contains the text '2'.");
        assert.equal(terminal.getRow(1), "1", "Row 1 contains the text '1'.");

        terminal.addRow("3");
        assert.equal(terminal.rowAmount, 2, "Terminal still has 2 rows of text.");
        assert.equal(terminal.getRow(0), "3", "Row 0 contains the text '3'.");
        assert.equal(terminal.getRow(1), "2", "Row 1 contains the text '2'.");
    });

    QUnit.test("Getting and setting rows in terminal", function (assert) {

        var terminal = new Terminal.Terminal(document.getElementById("test-terminal"), 2);

        terminal.addRow("A");
        terminal.addRow("B");
        assert.equal(terminal.getRow(0), "B", "Row 0 contains the text 'B'.");
        assert.equal(terminal.getRow(1), "A", "Row 1 contains the text 'A'.");

        terminal.setRow(0, "X");
        assert.equal(terminal.getRow(0), "X", "Row 0 contains the text 'X'.");
        assert.equal(terminal.getRow(1), "A", "Row 1 contains the text 'A'.");

        terminal.setRow(1, "Y");
        assert.equal(terminal.getRow(0), "X", "Row 0 contains the text 'X'.");
        assert.equal(terminal.getRow(1), "Y", "Row 1 contains the text 'Y'.");

        assert.equal(terminal.getTop(), "X", "Top row contains the text 'X'.");
        terminal.setTop("Z");
        assert.equal(terminal.getTop(), "Z", "Top row contains the text 'Z'.");
    });
});