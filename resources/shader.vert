attribute vec4 a_Position;
attribute vec4 a_Color;

varying vec4 v_Color;

void main() {
    gl_Position = vec4(a_Position.xy, 0.0, 1.0);
    gl_PointSize = 8.0 + 4.0 * a_Position.z;
    v_Color = a_Color * (1.0 + a_Position.z) * 0.5;
}