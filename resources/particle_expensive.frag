precision highp float;

varying vec4 v_Position;
varying vec4 v_Color;

// Calculates alpha transparency of gl.POINT, making it a smooth circle.
float calculatePlanetAlpha();

void main() {

	const vec3 lightOrigin = vec3(0.0);
	const vec3 lightColor = vec3(1.0, 0.9, 0.6);
	
	vec3 lightDirection = normalize(lightOrigin - vec3(v_Position.x, -1.0 * v_Position.y, v_Position.z));
	vec3 planetNormal = normalize(vec3((gl_PointCoord - vec2(0.5)) * 2.0, cos((gl_PointCoord.x - 0.5) * 2.0)));
	
	vec3 color = lightColor * v_Color.rgb * dot(lightDirection, planetNormal);
	
	const float MAXITERATIONS = 50.0;
	const float LIMIT = 5.0;
	const float INCREMENT = 0.8;
	
	float x0 = gl_PointCoord.x * 0.0001 + 0.317;
	float y0 = gl_PointCoord.y * 0.0001 + 0.495;
	float x;
	float y;
	float count = 0.0;
	
	for (float i = 0.0; i < MAXITERATIONS; i += INCREMENT) {
		
		if (distance(x, y) > LIMIT)
			break;
		
		float xTemp = pow(x, 2.0) - pow(y, 2.0);
		y = (2.0 * x * y) + y0;
		x = xTemp + x0;
		count += INCREMENT;
	}
	
    gl_FragColor = vec4(color, calculatePlanetAlpha() * v_Color.a);
}

#define POINT_CENTER vec2(0.5)
float calculatePlanetAlpha() {
	float distanceFromCenter = distance(gl_PointCoord, POINT_CENTER);
	return smoothstep(0.50, 0.45, distanceFromCenter);
}
