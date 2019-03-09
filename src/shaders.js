const fragment = `
precision mediump float;

void main(){
   gl_FragColor = vec4(vec3(0.5),1.);
}
`;
const vertex = `
uniform float u_scroll;
void main() { 
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y + u_scroll, position.z, 1.);
}`;

export { fragment, vertex };
