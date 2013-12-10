define(["webgl"], function (WebGL) {

	function Cloud(gl, sourceVertexShader, sourceFragmentShader, vertexBufferAmount) {

		var program = WebGL.createProgramFrom(gl,
		    sourceVertexShader,
		    sourceFragmentShader
		);
		gl.useProgram(program);
		
		var vboBuffer = new WebGL.VBOBuffer(gl, vertexBufferAmount, [
		    new WebGL.VertexAttribute(gl.getAttribLocation(program, "a_Position"), 4),
		    new WebGL.VertexAttribute(gl.getAttribLocation(program, "a_Color"), 4)
		]);
		
		this.render = function (cloud) {
			gl.clear(gl.COLOR_BUFFER_BIT);
		
			gl.useProgram(program);
            vboBuffer.upload(cloud.getData());

            vboBuffer.enable();
            gl.drawArrays(gl.POINTS, 0, cloud.getParticleAmount());
            vboBuffer.disable();
		}
	}

	function Post(gl, sourceVertexShader, sourceFragmentShader, textureSize, vertexBufferAmount) {

		var program = WebGL.createProgramFrom(gl,
		    sourceVertexShader,
		    sourceFragmentShader
		);
		gl.useProgram(program);
		
		var u_Texture = gl.getUniformLocation(program, "u_Texture");
		var u_WindowSize = gl.getUniformLocation(program, "u_WindowSize");
		var u_TextureSize = gl.getUniformLocation(program, "u_TextureSize");
		
		var vboBuffer = new WebGL.VBOBuffer(gl, vertexBufferAmount, [
		    new WebGL.VertexAttribute(gl.getAttribLocation(program, "a_Position"), 2)
		]);
		var quad = new Float32Array([
			0, 1,
			0, 0,
			1, 1,
			1, 0
		]);
		
		this.render = function (texture) {
			gl.useProgram(program);
			vboBuffer.upload(quad);

			gl.uniform1f(u_TextureSize, textureSize);
			gl.uniform2f(u_WindowSize, gl.drawingBufferWidth, gl.drawingBufferHeight);

			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.uniform1i(u_Texture, 0);
			
            vboBuffer.enable();
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            vboBuffer.disable();
		}
	}
	
	return {
		Cloud: Cloud,
		Post: Post
	};
});
