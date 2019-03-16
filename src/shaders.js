const fragment = `
precision mediump float;
uniform sampler2D u_texture;
uniform vec2 u_textureFactor;
varying vec2 vUv;
void main(){
  vec2 textureUV = vec2(vUv.x, 1.-vUv.y) * u_textureFactor - u_textureFactor / 2. + 0.5;
  vec3 color = texture2D(u_texture, textureUV ).xyz;
   gl_FragColor = vec4(color,1.);
}
`;
const vertex = `
uniform float u_scroll;
varying vec2 vUv;
void main() { 
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xyz, 1.);
  vUv = uv;
}`;

export { fragment, vertex };
