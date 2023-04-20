shaders.planet_vert = `
varying vec3 vNormal;
varying vec3 vColor;
uniform float wetness;
varying vec4 vLight;

float hash( const in float n ) {
	return fract(sin(n)*4378.5453);
}

float pnoise(in vec3 o)
{
	vec3 p = floor(o);
	vec3 fr = fract(o);

	float n = p.x + p.y*57.0 + p.z * 1009.0;

	float a = hash(n+  0.0);
	float b = hash(n+  1.0);
	float c = hash(n+ 57.0);
	float d = hash(n+ 58.0);

	float e = hash(n+  0.0 + 1009.0);
	float f = hash(n+  1.0 + 1009.0);
	float g = hash(n+ 57.0 + 1009.0);
	float h = hash(n+ 58.0 + 1009.0);


	vec3 fr2 = fr * fr;
	vec3 fr3 = fr2 * fr;

	vec3 t = 3.0 * fr2 - 2.0 * fr3;

	float u = t.x;
	float v = t.y;
	float w = t.z;

	// this last bit should be refactored to the same form as the rest :)
	float res1 = a + (b-a)*u +(c-a)*v + (a-b+d-c)*u*v;
	float res2 = e + (f-e)*u +(g-e)*v + (e-f+h-g)*u*v;

	float res = res1 * (1.0- w) + res2 * (w);

	return res;
}

const mat3 m = mat3( 0.00,  0.80,  0.60,
                    -0.80,  0.36, -0.48,
                    -0.60, -0.48,  0.64 );

float SmoothNoise( vec3 p )
{
    float f;
    f  = 0.5000*pnoise( p );
    p = m*p*2.02;
    f += 0.2500*pnoise( p );

    return f * (1.0 / (0.5000 + 0.2500));
}

void main() {

  vNormal = mat3(transpose(inverse(modelViewMatrix))) * normal;
  float height = SmoothNoise(normal) * 5.0 - 3.0 * wetness;
  vec3 newPosition = position + normal * height;
  float c = clamp(height, -3.0, 1.0);
  vColor = vec3(c, c, c);
  vLight = modelViewMatrix * vec4(0.5, 1.2, 1.5, 1.0);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`;

shaders.planet_frag = `
varying vec3 vNormal;
varying vec3 vColor;
uniform vec3 color;
varying vec4 vLight;

void main() {
  vec3 light = vec3(0.5, 1.2, 3.0);
  // ensure it's normalized
  light = normalize(light);
  // calculate the dot product of
  // the light to the vertex normal
  float dProd = max(dot(vNormal, light), 0.0) * 0.15;

  // feed into our frag colour
  vec3 surface_color = vec3(0.0, 0.24, 0.67);
  if (vColor.x > 0.0) {
      surface_color = color * clamp(vColor, 0.7, 1.0);
  }

	//The light is a yellow color
  gl_FragColor = vec4(surface_color * dProd, 1.0);
}
`;
