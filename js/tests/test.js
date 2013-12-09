(function () {
    require.config({
        baseUrl: "js"
    });

    var tests = [
        "tests/test_cloud"
    ];
    require(tests, QUnit.start);
}());
