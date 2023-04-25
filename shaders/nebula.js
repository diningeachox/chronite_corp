shaders.nebula = `
uniform vec2 u_resolution;
uniform float u_time;

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
    f  = 0.5000*pnoise( p ); p = m*p*2.02;
    f += 0.2500*pnoise( p );

    return f * (1.0 / (0.5000 + 0.2500));
}

// 2D rotation function
mat2 rot2D(float a) {
	return mat2(cos(a),sin(a),-sin(a),cos(a));
}

vec3 getStars(in vec3 from, in vec3 dir, int levels, float power)
{
	vec3 color=vec3(0.0);
	vec3 st = (dir * 2.+ vec3(0.3,2.5,1.25)) * .3;
	for (int i = 0; i < levels; i++) st = abs(st) / dot(st,st) - .9;
    float star = min( 1., pow( min( 5., length(st) ), 3. ) * .0025 )*1.5;

   	vec3 randc = vec3(SmoothNoise( dir.xyz*10.0*float(levels) ), SmoothNoise( dir.xzy*10.0*float(levels) ), SmoothNoise( dir.yzx*10.0*float(levels) ));
	color += star * randc;

	return pow(color*2.25, vec3(power));
}

void main()
{
		vec2 uv = gl_FragCoord.xy / u_resolution.xy;
		vec2 uvo=(uv-.5)*2.;
		vec2 oriuv=uv;
		uv=uv*2.-1.;
		uv.y*=u_resolution.y/u_resolution.x;
		uv.y-=.03;

		vec3 dir=normalize(vec3(uv,.8));

    mat2 camrot2 = rot2D(u_time / 10000.0);
		dir.xy*=camrot2;
    dir.yz*=rot2D(2.1);
    dir = normalize(dir);
		vec3 from=vec3(0.0);
    vec3 color=clamp(getStars(from, dir, 1, 0.5) * 1.5, 0.0, 1.0) * vec3(0.0, 0.0, 1.0);
		vec3 color2=clamp(getStars(from, -dir, 2, 0.5) * 0.9, 0.0, 1.0) * vec3(1.0, 0.0, 0.0);
    vec3 color3=clamp(getStars(from, -dir, 3, 0.5) * 0.7, 0.0, 1.0) * vec3(1.0, 1.0, 0.0);

    vec3 colorStars=clamp(getStars(from, dir, 15, 0.9), 0.0, 1.0);
    color = color + color2 + color3 + colorStars;
		color=clamp(color,vec3(0.0),vec3(1.0));
    color = pow(color, vec3(1.2));
		gl_FragColor = vec4(color * 0.5, 0.7);
}

`;

shaders.nebula2 = `
// By Jared Berghold 2022 (https://www.jaredberghold.com/)
// Based on the "Simplicity Galaxy" shader by CBS (https://www.shadertoy.com/view/MslGWN)
// The nebula effect is based on the kaliset fractal (https://softologyblog.wordpress.com/2011/05/04/kalisets-and-hybrid-ducks/)

const int MAX_ITER = 12;
uniform vec2 u_resolution;
uniform float u_time;

float field(vec3 p, float s, int iter)
{
		float accum = s / 4.0;
		float prev = 0.0;
		float tw = 0.0;
		for (int i = 0; i < MAX_ITER; ++i)
	  	{
			if (i >= iter) // drop from the loop if the number of iterations has been completed - workaround for GLSL loop index limitation
			{
				break;
			}
			float mag = dot(p, p);
			p = abs(p) / mag + vec3(-0.5, -0.4, -1.487);
			float w = exp(-float(i) / 5.0);
			accum += w * exp(-9.025 * pow(abs(mag - prev), 2.2));
			tw += w;
			prev = mag;
		}
		return max(0.0, 5.2 * accum / tw - 0.65);
}

vec3 nrand3(vec2 co)
{
		vec3 a = fract(cos(co.x*8.3e-3 + co.y) * vec3(1.3e5, 4.7e5, 2.9e5));
		vec3 b = fract(sin(co.x*0.3e-3 + co.y) * vec3(8.1e5, 1.0e5, 0.1e5));
		vec3 c = mix(a, b, 0.5);
		return c;
}

vec4 starLayer(vec2 p, float time)
{
		vec2 seed = 1.9 * p.xy;
		seed = floor(seed * max(u_resolution.x, 600.0) / 1.5);
		vec3 rnd = nrand3(seed);
		vec4 col = vec4(pow(rnd.y, 17.0));
		float mul = 10.0 * rnd.x;
		col.xyz *= sin(time * mul + mul) * 0.25 + 1.0;
		return col;
}

void main()
{
    float time = (u_time / (u_resolution.x / 1000.0)) / 60.0;

    // first layer of the kaliset fractal
		vec2 uv = 2.0 * gl_FragCoord.xy / u_resolution.xy - 1.0;
	  vec2 uvs = uv * u_resolution.xy / max(u_resolution.x, u_resolution.y);
		vec3 p = vec3(uvs / 2.5, 0.0) + vec3(0.8, -1.3, 0.0);
		p += 0.45 * vec3(sin(time / 32.0), sin(time / 24.0), sin(time / 64.0));


		float freqs[4];
		freqs[0] = 0.45;
		freqs[1] = 0.4;
		freqs[2] = 0.15;
		freqs[3] = 0.9;

		float t = field(p, freqs[2], 13);
		float v = (1.0 - exp((abs(uv.x) - 1.0) * 6.0)) * (1.0 - exp((abs(uv.y) - 1.0) * 6.0));

	  // second layer of the kaliset fractal
		vec3 p2 = vec3(uvs / (4.0 + sin(time * 0.11) * 0.2 + 0.2 + sin(time * 0.15) * 0.3 + 0.4), 4.0) + vec3(2.0, -1.3, -1.0);
		p2 += 0.16 * vec3(sin(time / 32.0), sin(time / 24.0), sin(time / 64.0));

		float t2 = field(p2, freqs[3], 18);
		vec4 c2 = mix(0.5, 0.2, v) * vec4(5.5 * t2 * t2 * t2, 2.1 * t2 * t2, 2.2 * t2 * freqs[0], t2);

		// add stars (source: https://glslsandbox.com/e#6904.0)
		vec4 starColour = vec4(0.0);
		starColour += starLayer(p.xy, time); // add first layer of stars
		//starColour += starLayer(p2.xy, time); // add second layer of stars

		const float brightness = 0.4;
		vec4 colour = mix(freqs[3] - 0.3, 0.4, v) * vec4(1.5 * freqs[2] * t * t * t, 1.2 * freqs[1] * t * t, freqs[3] * t, 1.0) + c2 + starColour;
		gl_FragColor = vec4(brightness * colour.xyz, 1.0);
}

`;
