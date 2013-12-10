attribute vec2 a_Position;
varying vec2 v_Position;

uniform vec2 u_WindowSize;
uniform float u_TextureSize;

void main() {
	gl_Position = vec4(((a_Position * u_TextureSize / u_WindowSize) - vec2(0.5)) * 2.0, 0.0, 1.0);
	v_Position = a_Position;
}

