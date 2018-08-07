export default `\
#define SHADER_NAME icon-layer-vertex-shader
attribute vec2 positions;
attribute vec3 instancePositions;
attribute vec2 instancePositions64xyLow;
attribute float instanceSizes;
attribute float instanceAngles;
attribute vec4 instanceColors;
attribute vec3 instancePickingColors;
attribute vec4 instanceIconFrames;
attribute float instanceColorModes;
attribute vec2 instanceOffsets;

uniform float heightMinPixels;
uniform float heightMaxPixels;
uniform float scaleWithMap;
uniform float sizeScale;
uniform vec2 iconsTextureDim;

varying float vColorMode;
varying vec4 vColor;
varying vec2 vTextureCoords;
vec2 rotate_by_angle(vec2 vertex, float angle) {
  float angle_radian = angle * PI / 180.0;
  float cos_angle = cos(angle_radian);
  float sin_angle = sin(angle_radian);
  mat2 rotationMatrix = mat2(cos_angle, -sin_angle, sin_angle, cos_angle);
  return rotationMatrix * vertex;
}
void main(void) {
  vec2 iconSize = instanceIconFrames.zw;
  // scale icon height to match instanceSize
  float instanceScale = iconSize.y == 0.0 ? 0.0 : scaleWithMap == 1.0 ? (clamp(
      project_scale(sizeScale * iconSize.y),
      heightMinPixels, heightMaxPixels
    ) / iconSize.y)
    : instanceSizes / iconSize.y;
  // scale and rotate vertex in "pixel" value and convert back to fraction in clipspace
  vec2 pixelOffset = positions / 2.0 * iconSize + instanceOffsets;
  pixelOffset = rotate_by_angle(pixelOffset, instanceAngles) * sizeScale * instanceScale;
  pixelOffset.y *= -1.0;
  gl_Position = project_position_to_clipspace(instancePositions, instancePositions64xyLow, vec3(0.0));
  gl_Position += project_pixel_to_clipspace(pixelOffset);
  vTextureCoords = mix(
    instanceIconFrames.xy,
    instanceIconFrames.xy + iconSize,
    (positions.xy + 1.0) / 2.0
  ) / iconsTextureDim;
  vTextureCoords.y = 1.0 - vTextureCoords.y;
  vColor = instanceColors / 255.;
  vColorMode = instanceColorModes;
  // Set color to be rendered to picking fbo (also used to check for selection highlight).
  picking_setPickingColor(instancePickingColors);
}
`;
