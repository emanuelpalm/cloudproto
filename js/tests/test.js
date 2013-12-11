(function () {
    require.config({
        baseUrl: "js"
    });

    var tests = [
        "tests/test_analyzer",
        "tests/test_cloud",
        "tests/test_terminal",
        "tests/test_utilities",
        "tests/test_webgl"
    ];
    require(tests, QUnit.start);
}());
