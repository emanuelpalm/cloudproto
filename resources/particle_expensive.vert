attribute vec4 a_Position;
attribute vec4 a_Color;

varying vec4 v_Position;
varying vec4 v_Color;

void main() {
    gl_Position = vec4(a_Position.xy, 0.0, 1.0);
    gl_PointSize = 64.0;
    
    v_Position = a_Position;
    v_Color = a_Color;
}
