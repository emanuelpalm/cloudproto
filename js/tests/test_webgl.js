define(function (require) {
    QUnit.module("WebGL");
    var WebGL = require("webgl");

    QUnit.test("WebGL context creation", function (assert) {
        var canvas = document.getElementById("test-canvas");
        var gl = WebGL.getContextFrom(canvas);
        assert.ok(gl, "Created WebGL context.");
    });
    
    QUnit.test("Determining valid texture size from given dimensions", function (assert) {
        var gl = {
            getParameter: function(param) { return 4096; },
            MAX_TEXTURE_SIZE: 0
        };
        
        var testSizes = [
            { width:  0,     height: 0     },
            { width:  10,    height: 40    },
            { width:  256,   height: 256   },
            { width: -902,   height: 231   },
            { width:  1024,  height: 768   },
            { width:  60000, height: 20000 }
        ];
        testSizes.forEach(function(size) {
            testIfValid(gl, size);
        });
        
        function testIfValid(gl, size) {

            var validatedSize = WebGL.getValidTextureSizeFrom(gl, size);
            var msg = size.width + "x" + size.height + " became "
                + validatedSize.width + "x" + validatedSize.height + ".";
            
            assert.ok(isValid(validatedSize), msg);
        
            function isValid(size) {

                return (size.width > 0) && (size.width === size.height) && isPowerOf2(size.width);
                
                function isPowerOf2(x) {
                    return (size.width & (size.width - 1)) === 0;
                }
            }
        }
    });
});
