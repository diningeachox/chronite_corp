shaders.tex_vert = `
varying vec2 vUv;
varying vec3 vecPos;
varying vec3 vecNormal;

void main() {
  vUv = uv;
  // Since the light is in camera coordinates,
  // I'll need the vertex position in camera coords too
  vecPos = (modelViewMatrix * vec4(position, 1.0)).xyz;
  // That's NOT exacly how you should transform your
  // normals but this will work fine, since my model
  // matrix is pretty basic
  vecNormal = (modelViewMatrix * vec4(normal, 0.0)).xyz;
  gl_Position = projectionMatrix *
                vec4(vecPos, 1.0);
}
`;

shaders.tex_frag = `
varying vec2 vUv;
varying vec3 vecPos;
varying vec3 vecNormal;

uniform float lightIntensity;
uniform sampler2D textureSampler;

void main(void) {
  gl_FragColor = texture2D(textureSampler, vUv) * vec4(1.0, 1.0, 1.0, 0.5);
}
`;
