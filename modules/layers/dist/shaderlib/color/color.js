"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
// TODO - this module is a WIP

/* eslint-disable camelcase */
var INITIAL_STATE = {
  color_uOpacity: 1.0,
  color_uDesaturate: 0.0,
  color_uBrightness: 1.0
};

function getUniforms() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INITIAL_STATE;
  var uniforms = {};

  if (opts.opacity) {
    uniforms.color_uOpacity = opts.opacity;
  }

  return uniforms;
}

var vs = "varying vec4 color_vColor;\n\ncolor_setColor(vec4 color) {\n  color_vColor = color;\n}\n";
var fs = "uniform float color_uOpacity;\nuniform float color_uDesaturate;\nuniform float color_uBrightness;\n\nvarying vec4 color_vColor;\n\nvec4 color_getColor() {\n  return color_vColor;\n}\n\nvec4 color_filterColor(vec4 color) {\n  // apply desaturation and brightness\n  if (color_uDesaturate > 0.01) {\n    float luminance = (color.r + color.g + color.b) * 0.333333333 + color_uBrightness;\n    color = vec4(mix(color.rgb, vec3(luminance), color_uDesaturate), color.a);\n\n  // Apply opacity\n  color = vec4(color.rgb, color.a * color_uOpacity);\n  return color;\n}\n";
var _default = {
  name: 'color',
  vs: vs,
  fs: fs,
  getUniforms: getUniforms
};
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zaGFkZXJsaWIvY29sb3IvY29sb3IudHMiXSwibmFtZXMiOlsiSU5JVElBTF9TVEFURSIsImNvbG9yX3VPcGFjaXR5IiwiY29sb3JfdURlc2F0dXJhdGUiLCJjb2xvcl91QnJpZ2h0bmVzcyIsImdldFVuaWZvcm1zIiwib3B0cyIsInVuaWZvcm1zIiwib3BhY2l0eSIsInZzIiwiZnMiLCJuYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7QUFFQTtBQUNBLElBQU1BLGFBQXFDLEdBQUc7QUFDNUNDLEVBQUFBLGNBQWMsRUFBRSxHQUQ0QjtBQUU1Q0MsRUFBQUEsaUJBQWlCLEVBQUUsR0FGeUI7QUFHNUNDLEVBQUFBLGlCQUFpQixFQUFFO0FBSHlCLENBQTlDOztBQU1BLFNBQVNDLFdBQVQsR0FBMkM7QUFBQSxNQUF0QkMsSUFBc0IsdUVBQWZMLGFBQWU7QUFDekMsTUFBTU0sUUFBZ0MsR0FBRyxFQUF6Qzs7QUFDQSxNQUFJRCxJQUFJLENBQUNFLE9BQVQsRUFBa0I7QUFDaEJELElBQUFBLFFBQVEsQ0FBQ0wsY0FBVCxHQUEwQkksSUFBSSxDQUFDRSxPQUEvQjtBQUNEOztBQUNELFNBQU9ELFFBQVA7QUFDRDs7QUFFRCxJQUFNRSxFQUFFLDZGQUFSO0FBUUEsSUFBTUMsRUFBRSx1akJBQVI7ZUF1QmU7QUFDYkMsRUFBQUEsSUFBSSxFQUFFLE9BRE87QUFFYkYsRUFBQUEsRUFBRSxFQUFGQSxFQUZhO0FBR2JDLEVBQUFBLEVBQUUsRUFBRkEsRUFIYTtBQUliTCxFQUFBQSxXQUFXLEVBQVhBO0FBSmEsQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIFRPRE8gLSB0aGlzIG1vZHVsZSBpcyBhIFdJUFxuXG4vKiBlc2xpbnQtZGlzYWJsZSBjYW1lbGNhc2UgKi9cbmNvbnN0IElOSVRJQUxfU1RBVEU6IFJlY29yZDxzdHJpbmcsIG51bWJlcj4gPSB7XG4gIGNvbG9yX3VPcGFjaXR5OiAxLjAsXG4gIGNvbG9yX3VEZXNhdHVyYXRlOiAwLjAsXG4gIGNvbG9yX3VCcmlnaHRuZXNzOiAxLjAsXG59O1xuXG5mdW5jdGlvbiBnZXRVbmlmb3JtcyhvcHRzID0gSU5JVElBTF9TVEFURSkge1xuICBjb25zdCB1bmlmb3JtczogUmVjb3JkPHN0cmluZywgbnVtYmVyPiA9IHt9O1xuICBpZiAob3B0cy5vcGFjaXR5KSB7XG4gICAgdW5pZm9ybXMuY29sb3JfdU9wYWNpdHkgPSBvcHRzLm9wYWNpdHk7XG4gIH1cbiAgcmV0dXJuIHVuaWZvcm1zO1xufVxuXG5jb25zdCB2cyA9IGBcXFxudmFyeWluZyB2ZWM0IGNvbG9yX3ZDb2xvcjtcblxuY29sb3Jfc2V0Q29sb3IodmVjNCBjb2xvcikge1xuICBjb2xvcl92Q29sb3IgPSBjb2xvcjtcbn1cbmA7XG5cbmNvbnN0IGZzID0gYFxcXG51bmlmb3JtIGZsb2F0IGNvbG9yX3VPcGFjaXR5O1xudW5pZm9ybSBmbG9hdCBjb2xvcl91RGVzYXR1cmF0ZTtcbnVuaWZvcm0gZmxvYXQgY29sb3JfdUJyaWdodG5lc3M7XG5cbnZhcnlpbmcgdmVjNCBjb2xvcl92Q29sb3I7XG5cbnZlYzQgY29sb3JfZ2V0Q29sb3IoKSB7XG4gIHJldHVybiBjb2xvcl92Q29sb3I7XG59XG5cbnZlYzQgY29sb3JfZmlsdGVyQ29sb3IodmVjNCBjb2xvcikge1xuICAvLyBhcHBseSBkZXNhdHVyYXRpb24gYW5kIGJyaWdodG5lc3NcbiAgaWYgKGNvbG9yX3VEZXNhdHVyYXRlID4gMC4wMSkge1xuICAgIGZsb2F0IGx1bWluYW5jZSA9IChjb2xvci5yICsgY29sb3IuZyArIGNvbG9yLmIpICogMC4zMzMzMzMzMzMgKyBjb2xvcl91QnJpZ2h0bmVzcztcbiAgICBjb2xvciA9IHZlYzQobWl4KGNvbG9yLnJnYiwgdmVjMyhsdW1pbmFuY2UpLCBjb2xvcl91RGVzYXR1cmF0ZSksIGNvbG9yLmEpO1xuXG4gIC8vIEFwcGx5IG9wYWNpdHlcbiAgY29sb3IgPSB2ZWM0KGNvbG9yLnJnYiwgY29sb3IuYSAqIGNvbG9yX3VPcGFjaXR5KTtcbiAgcmV0dXJuIGNvbG9yO1xufVxuYDtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBuYW1lOiAnY29sb3InLFxuICB2cyxcbiAgZnMsXG4gIGdldFVuaWZvcm1zLFxufTtcbiJdfQ==