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

    mat2 camrot2 = rot2D(u_time / 1000.0);
	dir.xy*=camrot2;
    dir.yz*=rot2D(2.1);
    dir = normalize(dir);
	vec3 from=vec3(0.0);
    vec3 color=clamp(getStars(from, dir, 1, 0.5) * 1.5, 0.0, 1.0) * vec3(0.0, 0.0, 1.0);
	vec3 color2=clamp(getStars(from, -dir, 2, 0.5) * 0.9, 0.0, 1.0) * vec3(1.0, 0.0, 0.0);
    vec3 color3=clamp(getStars(from, -dir, 3, 0.5) * 0.7, 0.0, 1.0) * vec3(1.0, 1.0, 0.0);

    //vec3 colorStars=clamp(getStars(from, dir, 15, 0.9), 0.0, 1.0);
    color = color + color2 + color3;
	color=clamp(color,vec3(0.0),vec3(1.0));
    color = pow(color, vec3(1.2));
	gl_FragColor = vec4(color,1.);
}

`;
