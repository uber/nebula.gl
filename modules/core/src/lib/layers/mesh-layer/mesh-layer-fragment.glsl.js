export default `
#define SHADER_NAME mesh-layer-fs

precision highp float;

uniform bool hasTexture;
uniform sampler2D sampler;
uniform vec4 color;

varying vec2 vTexCoord;
varying vec4 vColor;

void main(void) {
  gl_FragColor = hasTexture ? texture2D(sampler, vTexCoord) : vColor / 255.;

  // use highlight color if this fragment belongs to the selected object.
  gl_FragColor = picking_filterHighlightColor(gl_FragColor);

  // use picking color if rendering to picking FBO.
  gl_FragColor = picking_filterPickingColor(gl_FragColor);
}
`;
