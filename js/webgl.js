define([], function () {

    /**
     * Create new WebGL shader program.
     *
     * @param {WebGLObject} gl - WebGL context reference.
     * @param {string} sourceVertexShader - Vertex shader source.
     * @param {string} sourceFragmentShader - Fragment shader source.
     * @returns {WebGLProgram} Created WebGL program.
     * @throws {string} Description of error.
     */
    function createProgramFrom(gl, sourceVertexShader, sourceFragmentShader) {

        return linkProgram(
            compileShader(sourceVertexShader, gl.VERTEX_SHADER),
            compileShader(sourceFragmentShader, gl.FRAGMENT_SHADER)
        );

        function compileShader(source, type) {
            var s = gl.createShader(type);
            gl.shaderSource(s, source);
            gl.compileShader(s);

            if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
                throw "Shader compile error '" + gl.getShaderInfoLog(s) + "'.";

            return s;
        }

        function linkProgram(vertexShader, fragmentShader) {
            var p = gl.createProgram();
            gl.attachShader(p, vertexShader);
            gl.attachShader(p, fragmentShader);
            gl.linkProgram(p);

            if (!gl.getProgramParameter(p, gl.LINK_STATUS))
                throw "Unable to link shader program.";

            return p;
        }
    }

    /**
     * Acquire valid WebGL context.
     *
     * @param {HTMLCanvasElement} canvas - Canvas element from which to acquire WebGL context.
     * @returns {WebGLObject} WebGL context object.
     *
     * @throws {string} Description of error.
     */
    function getContextFrom(canvas) {
        var names = ["moz-webgl", "webkit-3d", "experimental-webgl", "webgl"];
        var gl = null;

        for (var i = names.length; i-- && !gl;) {
            try {
                gl = canvas.getContext(names[i]);
            } catch (e) {
                console.log("'" + names[i] + "' context not available.");
            }
        }
        if (!gl)
            throw "Unable to create WebGL context.";

        return gl;
    }

    /**
     * Determines a valid texture size from given pixel dimensions. Valid textures always square,
     * with each side a power of 2.
     *
     * @param {WebGLObject] gl - WebGL context.
     * @param {object} dimensions - Object with width and height attribute.
     * @returns {number} Valid texture size.
     */
    function getValidTextureSizeFrom(gl, dimensions) {
        var threshold = (dimensions.width > dimensions.height)
            ? dimensions.width
            : dimensions.height;

        var size = 1;
        while (size < threshold)
            size *= 2;

        var maxSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        if (size > maxSize)
            size = maxSize;

        return size;
    }

    /**
     * Captures rendered data into one of N off-screen buffers. The buffers are acquired in FIFO
     * order.
     *
     * @param {WebGLObject} gl - WebGL context.
     * @param {number} n - Amount of off-screen buffers to use.
     * @param {number} bufferSize - The, power of 2, pixel size of a side of a frame buffer texture.
     * @constructor
     */
    function FBOBuffer(gl, n, bufferSize) {

        var frameBuffer = gl.createFramebuffer();
        var frameBufferTextures = initializeFrameBufferTextures();

        var captureSlot = 0;
        var releaseSlot = 1 % n;

        function initializeFrameBufferTextures() {

            var textures = new Array(n);
            for (var i = n; i--;)
                textures[i] = initializeFrameBufferTexture();

            return textures;

            function initializeFrameBufferTexture() {
                var texture = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texImage2D(
                    gl.TEXTURE_2D,
                    0,
                    gl.RGBA,
                    bufferSize,
                    bufferSize,
                    0,
                    gl.RGBA,
                    gl.UNSIGNED_BYTE,
                    null
                );
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                return texture;
            }
        }

        /**
         * Start to capture draw calls into next off-screen buffer.
         */
        this.startCapture = function () {
            gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
            gl.framebufferTexture2D(
                gl.FRAMEBUFFER,
                gl.COLOR_ATTACHMENT0,
                gl.TEXTURE_2D,
                frameBufferTextures[captureSlot++ % n],
                0
            );
        }

        /**
         * Stop to capture draw calls into off-screen buffer.
         */
        this.stopCapture = function () {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }

        /**
         * @returns {WebGLTexture} Next buffer to render.
         */
        this.getNextBuffer = function () {
            return frameBufferTextures[releaseSlot++ % n];
        }
    }
    
    /**
     * Manages a circle of N vertex buffer objects, into which vertex data may be uploaded in turn.
     *
     * @param {WebGLObject} gl - WebGL context.
     * @param {number} n - Amount of vertex buffer objects to use.
     * @param {VertexAttribute[]} vertexAttributes - Vertex attributes identifying uploaded data.
     * @param constructor
     */
    function VBOBuffer(gl, n, vertexAttributes) {

        var WORD_SIZE = Float32Array.BYTES_PER_ELEMENT;
        var TOTAL_SIZE = getTotalAttributeSize() * WORD_SIZE;
        
        var vertexBuffers = initializeVertexBuffers();
        var activeVertexBuffer = 0;
        
        function getTotalAttributeSize() {
            return vertexAttributes.reduce(function(acc, elem) {
                return acc + elem.size;
            });
        }
    
        function initializeVertexBuffers() {
            var vertexBuffers = new Array(n);
            for (var i = n; i--;)
                vertexBuffers[i] = gl.createBuffer();

            return vertexBuffers;
        }
        
        /**
         * Uploads given vertex data to a suitable WebGL context buffer. The data is an array of
         * 32-bit floats, where the designated use and ordering of the floats is determined by the 
         * array of VertexAttribute objects given at VBOBuffer object creation.
         *
         * @param {Float32Array} data - Data to upload to WebGL context.
         */
        this.upload = function (data) {
            gl.bindBuffer(gl.ARRAY_BUFFER, nextVertexBuffer());
            gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
            
            var offset = 0;
            vertexAttributes.forEach(function (v) {
                gl.vertexAttribPointer(
                    v.location,
                    v.size,
                    gl.FLOAT,
                    false,
                    TOTAL_SIZE,
                    offset
                );
                offset += (v.size * WORD_SIZE);
            });
            
            function nextVertexBuffer() {
                return vertexBuffers[activeVertexBuffer++ % n];
            }
        };
        
        /**
         * Enables encapsulated vertex attributes.
         */
        this.enable = function () {
            vertexAttributes.forEach(function (v) {
                gl.enableVertexAttribArray(v.location);
            });
        };
        
        /**
         * Disables encapsulated vertex attributes.
         */
        this.disable = function () {
            vertexAttributes.forEach(function (v) {
                gl.disableVertexAttribArray(v.location);
            });
        };
    }

    /**
     * Encapsulates a WebGL vertex attribute location and its word size.
     */
    function VertexAttribute(location, size) {
        this.location = location;
        this.size = size;
    }

    return {
        createProgramFrom: createProgramFrom,
        getContextFrom: getContextFrom,
        getValidTextureSizeFrom: getValidTextureSizeFrom,
        FBOBuffer: FBOBuffer,
        VBOBuffer: VBOBuffer,
        VertexAttribute: VertexAttribute
    };
});
