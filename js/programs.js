define(["webgl"], function (WebGL) {

    /**
     * Program for rendering a Cloud.
     *
     * @param {WebGLObject} gl - WebGL context.
     * @param {string} sourceVertexShader - Vertex shader source data.
     * @param {string} sourceFragmentShader - Fragment shader source data.
     * @constructor
     */
	function Cloud(gl, sourceVertexShader, sourceFragmentShader) {

		var program = WebGL.createProgramFrom(gl,
		    sourceVertexShader,
		    sourceFragmentShader
		);
		gl.useProgram(program);
		
		var vboBuffer = new WebGL.VBOBuffer(gl, 1, 8, [
		    new WebGL.VertexAttribute(gl.getAttribLocation(program, "a_Position"), 4),
		    new WebGL.VertexAttribute(gl.getAttribLocation(program, "a_Color"), 4)
		]);

        /**
         * @param {Cloud} cloud - Cloud to render.
         */
		this.render = function (cloud) {
			gl.clear(gl.COLOR_BUFFER_BIT);
		
			gl.useProgram(program);
            vboBuffer.upload(cloud.getData());

            vboBuffer.enable();
            gl.drawArrays(gl.POINTS, 0, cloud.getParticleAmount());
            vboBuffer.disable();
		}

        /**
         * @param {number} n - Target amount of VBOs to use. Has to be between 1 and 8.
         */
        this.setVBOBufferN = function (n) {
            vboBuffer.setN(n);
        };
	}

    /**
     * Post-processing program.
     *
     * @param {WebGLObject} gl - WebGL context.
     * @param {string} sourceVertexShader - Vertex shader source data.
     * @param {string} sourceFragmentShader - Fragment shader source data.
     * @constructor
     */
	function Post(gl, sourceVertexShader, sourceFragmentShader) {

		var program = WebGL.createProgramFrom(gl,
		    sourceVertexShader,
		    sourceFragmentShader
		);
		gl.useProgram(program);
		
		var u_Texture = gl.getUniformLocation(program, "u_Texture");
		var u_WindowSize = gl.getUniformLocation(program, "u_WindowSize");
		var u_TextureSize = gl.getUniformLocation(program, "u_TextureSize");
		
		var vboBuffer = new WebGL.VBOBuffer(gl, 1, 8, [
		    new WebGL.VertexAttribute(gl.getAttribLocation(program, "a_Position"), 2)
		]);
		var quad = new Float32Array([
			0, 1,
			0, 0,
			1, 1,
			1, 0
		]);

        var fboBuffer = new WebGL.FBOBuffer(gl, 1, 8);

        /**
         * Captures and draws the contents rendered by the given callback.
         *
         * @param {function} captureCallback - Callback function which contains rendering calls.
         */
		this.render = function (captureCallback) {
            fboBuffer.startCapture();
            captureCallback();
            fboBuffer.stopCapture();

			gl.useProgram(program);
			vboBuffer.upload(quad);

			gl.uniform1f(u_TextureSize, fboBuffer.getTextureSize());
			gl.uniform2f(u_WindowSize, gl.drawingBufferWidth, gl.drawingBufferHeight);

			gl.bindTexture(gl.TEXTURE_2D, fboBuffer.getNextBuffer());
			gl.uniform1i(u_Texture, 0);
			
            vboBuffer.enable();
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            vboBuffer.disable();
		}

        /**
         * @param {number} n - Target amount of FBO textures to use. Has to be between 1 and 8.
         */
        this.setFBOBufferN = function (n) {
            fboBuffer.setN(n);
        };

        /**
         * @param {number} n - Target amount of VBOs to use. Has to be between 1 and 8.
         */
        this.setVBOBufferN = function (n) {
            vboBuffer.setN(n);
        };
	}
	
	return {
		Cloud: Cloud,
		Post: Post
	};
});
