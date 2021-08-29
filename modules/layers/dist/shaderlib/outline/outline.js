"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

/* eslint-disable camelcase */
var INITIAL_STATE = {
  outlineEnabled: false,
  outlineRenderShadowmap: false,
  outlineShadowmap: null
};

function getUniforms() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INITIAL_STATE,
      outlineEnabled = _ref.outlineEnabled,
      outlineRenderShadowmap = _ref.outlineRenderShadowmap,
      outlineShadowmap = _ref.outlineShadowmap;

  var uniforms = {};

  if (outlineEnabled !== undefined) {
    // ? 1.0 : 0.0;
    uniforms.outline_uEnabled = outlineEnabled;
  }

  if (outlineRenderShadowmap !== undefined) {
    // ? 1.0 : 0.0;
    uniforms.outline_uRenderOutlines = outlineRenderShadowmap;
  }

  if (outlineShadowmap !== undefined) {
    uniforms.outline_uShadowmap = outlineShadowmap;
  }

  return uniforms;
}

var vs = "attribute float instanceZLevel;\nvarying float outline_vzLevel;\nvarying vec4 outline_vPosition;\n\n// Set the z level for the outline shadowmap rendering\nvoid outline_setZLevel(float zLevel) {\n  outline_vzLevel = zLevel;\n}\n\n// Store an adjusted position for texture2DProj\nvoid outline_setUV(vec4 position) {\n  // mat4(\n  //   0.5, 0.0, 0.0, 0.0,\n  //   0.0, 0.5, 0.0, 0.0,\n  //   0.0, 0.0, 0.5, 0.0,\n  //   0.5, 0.5, 0.5, 1.0\n  // ) * position;\n  outline_vPosition = vec4(position.xyz * 0.5 + position.w * 0.5, position.w);\n}\n";
var fs = "uniform bool outline_uEnabled;\nuniform bool outline_uRenderOutlines;\nuniform sampler2D outline_uShadowmap;\n\nvarying float outline_vzLevel;\n// varying vec2 outline_vUV;\nvarying vec4 outline_vPosition;\n\nconst float OUTLINE_Z_LEVEL_ERROR = 0.01;\n\n// Return a darker color in shadowmap\nvec4 outline_filterShadowColor(vec4 color) {\n  return vec4(outline_vzLevel / 255., outline_vzLevel / 255., outline_vzLevel / 255., 1.);\n}\n\n// Return a darker color if in shadowmap\nvec4 outline_filterDarkenColor(vec4 color) {\n  if (outline_uEnabled) {\n    float maxZLevel;\n    if (outline_vPosition.q > 0.0) {\n      maxZLevel = texture2DProj(outline_uShadowmap, outline_vPosition).r * 255.;\n    } else {\n      discard;\n    }\n    if (maxZLevel < outline_vzLevel + OUTLINE_Z_LEVEL_ERROR) {\n      vec4(color.rgb * 0.5, color.a);\n    } else {\n      discard;\n    }\n  }\n  return color;\n}\n\n// if enabled and rendering outlines - Render depth to shadowmap\n// if enabled and rendering colors - Return a darker color if in shadowmap\n// if disabled, just return color\nvec4 outline_filterColor(vec4 color) {\n  if (outline_uEnabled) {\n    return outline_uRenderOutlines ?\n      outline_filterShadowColor(color) :\n      outline_filterDarkenColor(color);\n  }\n  return color;\n}\n";
var _default = {
  name: 'outline',
  vs: vs,
  fs: fs,
  getUniforms: getUniforms
};
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zaGFkZXJsaWIvb3V0bGluZS9vdXRsaW5lLnRzIl0sIm5hbWVzIjpbIklOSVRJQUxfU1RBVEUiLCJvdXRsaW5lRW5hYmxlZCIsIm91dGxpbmVSZW5kZXJTaGFkb3dtYXAiLCJvdXRsaW5lU2hhZG93bWFwIiwiZ2V0VW5pZm9ybXMiLCJ1bmlmb3JtcyIsInVuZGVmaW5lZCIsIm91dGxpbmVfdUVuYWJsZWQiLCJvdXRsaW5lX3VSZW5kZXJPdXRsaW5lcyIsIm91dGxpbmVfdVNoYWRvd21hcCIsInZzIiwiZnMiLCJuYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7QUFDQSxJQUFNQSxhQUFrQyxHQUFHO0FBQ3pDQyxFQUFBQSxjQUFjLEVBQUUsS0FEeUI7QUFFekNDLEVBQUFBLHNCQUFzQixFQUFFLEtBRmlCO0FBR3pDQyxFQUFBQSxnQkFBZ0IsRUFBRTtBQUh1QixDQUEzQzs7QUFNQSxTQUFTQyxXQUFULEdBQW1HO0FBQUEsaUZBQWZKLGFBQWU7QUFBQSxNQUE1RUMsY0FBNEUsUUFBNUVBLGNBQTRFO0FBQUEsTUFBNURDLHNCQUE0RCxRQUE1REEsc0JBQTREO0FBQUEsTUFBcENDLGdCQUFvQyxRQUFwQ0EsZ0JBQW9DOztBQUNqRyxNQUFNRSxRQUE2QixHQUFHLEVBQXRDOztBQUNBLE1BQUlKLGNBQWMsS0FBS0ssU0FBdkIsRUFBa0M7QUFDaEM7QUFDQUQsSUFBQUEsUUFBUSxDQUFDRSxnQkFBVCxHQUE0Qk4sY0FBNUI7QUFDRDs7QUFDRCxNQUFJQyxzQkFBc0IsS0FBS0ksU0FBL0IsRUFBMEM7QUFDeEM7QUFDQUQsSUFBQUEsUUFBUSxDQUFDRyx1QkFBVCxHQUFtQ04sc0JBQW5DO0FBQ0Q7O0FBQ0QsTUFBSUMsZ0JBQWdCLEtBQUtHLFNBQXpCLEVBQW9DO0FBQ2xDRCxJQUFBQSxRQUFRLENBQUNJLGtCQUFULEdBQThCTixnQkFBOUI7QUFDRDs7QUFDRCxTQUFPRSxRQUFQO0FBQ0Q7O0FBRUQsSUFBTUssRUFBRSxtaUJBQVI7QUFzQkEsSUFBTUMsRUFBRSw0d0NBQVI7ZUErQ2U7QUFDYkMsRUFBQUEsSUFBSSxFQUFFLFNBRE87QUFFYkYsRUFBQUEsRUFBRSxFQUFGQSxFQUZhO0FBR2JDLEVBQUFBLEVBQUUsRUFBRkEsRUFIYTtBQUliUCxFQUFBQSxXQUFXLEVBQVhBO0FBSmEsQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIGNhbWVsY2FzZSAqL1xuY29uc3QgSU5JVElBTF9TVEFURTogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgb3V0bGluZUVuYWJsZWQ6IGZhbHNlLFxuICBvdXRsaW5lUmVuZGVyU2hhZG93bWFwOiBmYWxzZSxcbiAgb3V0bGluZVNoYWRvd21hcDogbnVsbCxcbn07XG5cbmZ1bmN0aW9uIGdldFVuaWZvcm1zKHsgb3V0bGluZUVuYWJsZWQsIG91dGxpbmVSZW5kZXJTaGFkb3dtYXAsIG91dGxpbmVTaGFkb3dtYXAgfSA9IElOSVRJQUxfU1RBVEUpIHtcbiAgY29uc3QgdW5pZm9ybXM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcbiAgaWYgKG91dGxpbmVFbmFibGVkICE9PSB1bmRlZmluZWQpIHtcbiAgICAvLyA/IDEuMCA6IDAuMDtcbiAgICB1bmlmb3Jtcy5vdXRsaW5lX3VFbmFibGVkID0gb3V0bGluZUVuYWJsZWQ7XG4gIH1cbiAgaWYgKG91dGxpbmVSZW5kZXJTaGFkb3dtYXAgIT09IHVuZGVmaW5lZCkge1xuICAgIC8vID8gMS4wIDogMC4wO1xuICAgIHVuaWZvcm1zLm91dGxpbmVfdVJlbmRlck91dGxpbmVzID0gb3V0bGluZVJlbmRlclNoYWRvd21hcDtcbiAgfVxuICBpZiAob3V0bGluZVNoYWRvd21hcCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdW5pZm9ybXMub3V0bGluZV91U2hhZG93bWFwID0gb3V0bGluZVNoYWRvd21hcDtcbiAgfVxuICByZXR1cm4gdW5pZm9ybXM7XG59XG5cbmNvbnN0IHZzID0gYFxcXG5hdHRyaWJ1dGUgZmxvYXQgaW5zdGFuY2VaTGV2ZWw7XG52YXJ5aW5nIGZsb2F0IG91dGxpbmVfdnpMZXZlbDtcbnZhcnlpbmcgdmVjNCBvdXRsaW5lX3ZQb3NpdGlvbjtcblxuLy8gU2V0IHRoZSB6IGxldmVsIGZvciB0aGUgb3V0bGluZSBzaGFkb3dtYXAgcmVuZGVyaW5nXG52b2lkIG91dGxpbmVfc2V0WkxldmVsKGZsb2F0IHpMZXZlbCkge1xuICBvdXRsaW5lX3Z6TGV2ZWwgPSB6TGV2ZWw7XG59XG5cbi8vIFN0b3JlIGFuIGFkanVzdGVkIHBvc2l0aW9uIGZvciB0ZXh0dXJlMkRQcm9qXG52b2lkIG91dGxpbmVfc2V0VVYodmVjNCBwb3NpdGlvbikge1xuICAvLyBtYXQ0KFxuICAvLyAgIDAuNSwgMC4wLCAwLjAsIDAuMCxcbiAgLy8gICAwLjAsIDAuNSwgMC4wLCAwLjAsXG4gIC8vICAgMC4wLCAwLjAsIDAuNSwgMC4wLFxuICAvLyAgIDAuNSwgMC41LCAwLjUsIDEuMFxuICAvLyApICogcG9zaXRpb247XG4gIG91dGxpbmVfdlBvc2l0aW9uID0gdmVjNChwb3NpdGlvbi54eXogKiAwLjUgKyBwb3NpdGlvbi53ICogMC41LCBwb3NpdGlvbi53KTtcbn1cbmA7XG5cbmNvbnN0IGZzID0gYFxcXG51bmlmb3JtIGJvb2wgb3V0bGluZV91RW5hYmxlZDtcbnVuaWZvcm0gYm9vbCBvdXRsaW5lX3VSZW5kZXJPdXRsaW5lcztcbnVuaWZvcm0gc2FtcGxlcjJEIG91dGxpbmVfdVNoYWRvd21hcDtcblxudmFyeWluZyBmbG9hdCBvdXRsaW5lX3Z6TGV2ZWw7XG4vLyB2YXJ5aW5nIHZlYzIgb3V0bGluZV92VVY7XG52YXJ5aW5nIHZlYzQgb3V0bGluZV92UG9zaXRpb247XG5cbmNvbnN0IGZsb2F0IE9VVExJTkVfWl9MRVZFTF9FUlJPUiA9IDAuMDE7XG5cbi8vIFJldHVybiBhIGRhcmtlciBjb2xvciBpbiBzaGFkb3dtYXBcbnZlYzQgb3V0bGluZV9maWx0ZXJTaGFkb3dDb2xvcih2ZWM0IGNvbG9yKSB7XG4gIHJldHVybiB2ZWM0KG91dGxpbmVfdnpMZXZlbCAvIDI1NS4sIG91dGxpbmVfdnpMZXZlbCAvIDI1NS4sIG91dGxpbmVfdnpMZXZlbCAvIDI1NS4sIDEuKTtcbn1cblxuLy8gUmV0dXJuIGEgZGFya2VyIGNvbG9yIGlmIGluIHNoYWRvd21hcFxudmVjNCBvdXRsaW5lX2ZpbHRlckRhcmtlbkNvbG9yKHZlYzQgY29sb3IpIHtcbiAgaWYgKG91dGxpbmVfdUVuYWJsZWQpIHtcbiAgICBmbG9hdCBtYXhaTGV2ZWw7XG4gICAgaWYgKG91dGxpbmVfdlBvc2l0aW9uLnEgPiAwLjApIHtcbiAgICAgIG1heFpMZXZlbCA9IHRleHR1cmUyRFByb2oob3V0bGluZV91U2hhZG93bWFwLCBvdXRsaW5lX3ZQb3NpdGlvbikuciAqIDI1NS47XG4gICAgfSBlbHNlIHtcbiAgICAgIGRpc2NhcmQ7XG4gICAgfVxuICAgIGlmIChtYXhaTGV2ZWwgPCBvdXRsaW5lX3Z6TGV2ZWwgKyBPVVRMSU5FX1pfTEVWRUxfRVJST1IpIHtcbiAgICAgIHZlYzQoY29sb3IucmdiICogMC41LCBjb2xvci5hKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGlzY2FyZDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNvbG9yO1xufVxuXG4vLyBpZiBlbmFibGVkIGFuZCByZW5kZXJpbmcgb3V0bGluZXMgLSBSZW5kZXIgZGVwdGggdG8gc2hhZG93bWFwXG4vLyBpZiBlbmFibGVkIGFuZCByZW5kZXJpbmcgY29sb3JzIC0gUmV0dXJuIGEgZGFya2VyIGNvbG9yIGlmIGluIHNoYWRvd21hcFxuLy8gaWYgZGlzYWJsZWQsIGp1c3QgcmV0dXJuIGNvbG9yXG52ZWM0IG91dGxpbmVfZmlsdGVyQ29sb3IodmVjNCBjb2xvcikge1xuICBpZiAob3V0bGluZV91RW5hYmxlZCkge1xuICAgIHJldHVybiBvdXRsaW5lX3VSZW5kZXJPdXRsaW5lcyA/XG4gICAgICBvdXRsaW5lX2ZpbHRlclNoYWRvd0NvbG9yKGNvbG9yKSA6XG4gICAgICBvdXRsaW5lX2ZpbHRlckRhcmtlbkNvbG9yKGNvbG9yKTtcbiAgfVxuICByZXR1cm4gY29sb3I7XG59XG5gO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG5hbWU6ICdvdXRsaW5lJyxcbiAgdnMsXG4gIGZzLFxuICBnZXRVbmlmb3Jtcyxcbn07XG4iXX0=