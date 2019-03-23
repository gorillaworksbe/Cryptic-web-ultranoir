const fragment = `
precision mediump float;
uniform sampler2D u_texture;
uniform vec2 u_textureFactor;
uniform float u_blackAndWhite;
uniform float u_opacityColor;
varying vec2 vUv;


void main(){
  vec2 textureUV = vec2(vUv.x, 1.-vUv.y) * u_textureFactor - u_textureFactor / 2. + 0.5;
  vec4 textureColor = texture2D(u_texture, textureUV );

  vec4 blackAndWhiteTexture = vec4(
      vec3( textureColor.x + textureColor.y+textureColor.z ) / 3.,
    1.
    );

  vec4 bwColored = mix(blackAndWhiteTexture, vec4(u_opacityColor), 0.9);

  vec4 color = mix(textureColor, bwColored, u_blackAndWhite);
   gl_FragColor = color;
}
`;
const vertex = `
uniform float u_scroll;
varying vec2 vUv;
uniform float u_maxDistance;
uniform float u_magnitude;
uniform float u_progress;
float q(float t)
{float p=2.0*t* t;
    return t<0.5?p:-p+(4.0*t)-1.0;
}
void main() { 
  float distance = length(position.xy);
  float zChange = 0.;
  
  if(distance<u_maxDistance){
      float normalizedDistance = distance / u_maxDistance;
      zChange = q(normalizedDistance);
      // zChange = normalizedDistance * u_magnitude * -0.25; 
        zChange = 1.-(zChange );
        zChange *= u_magnitude; 
        zChange *= u_progress;
  }
  vec3 pos = position.xyz;
  pos.z += zChange;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
  vUv = uv;
}`;

export { fragment, vertex };
