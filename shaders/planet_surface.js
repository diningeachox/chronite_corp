shaders.planet_vert = `
attribute float displacement;
varying vec3 vNormal;

void main() {
  vNormal = normal;
  vec3 newPosition = position + normal * vec3(1.2 * displacement);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`;

shaders.planet_frag = `
varying vec3 vNormal;
uniform vec3 color;

void main() {
  vec3 light = vec3(0.5, 1.2, 1.5);
  // ensure it's normalized
  light = normalize(light);
  // calculate the dot product of
  // the light to the vertex normal
  float dProd = max(0.0, dot(vNormal, light));

  // feed into our frag colour
  gl_FragColor = vec4(color * dProd, 1.0);
}
`;
