"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

// TODO - this module is a WIP

/* eslint-disable camelcase */
var INITIAL_STATE = {};

function getUniforms() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INITIAL_STATE;

  _objectDestructuringEmpty(_ref);
}

var vs = "// Note - fairly generic, move to a UV or screen package, or even project?\nvec2 project_clipspace_to_uv(vec4 position) {\n  vec2 p = vec2(position.x / position.w, position.y / position.w);\n  return vec2((p.x + 1.0) / 2.0, (p.y + 1.0) / 2.0);\n}\n\nvec2 project_clipspace_to_projective_uv(vec4 position) {\n  // outline_vPosition = mat4(\n  //   0.5, 0.0, 0.0, 0.0,\n  //   0.0, 0.5, 0.0, 0.0,\n  //   0.0, 0.0, 0.5, 0.0,\n  //   0.5, 0.5, 0.5, 1.0\n  // ) * position;\n  return vec4(position.xyz * 0.5 + position.w * 0.5, position.w);\n}\n";
var fs = vs;
var _default = {
  name: 'outline',
  vs: vs,
  fs: fs,
  getUniforms: getUniforms
};
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zaGFkZXJsaWIvdXRpbHMvdXRpbHMudHMiXSwibmFtZXMiOlsiSU5JVElBTF9TVEFURSIsImdldFVuaWZvcm1zIiwidnMiLCJmcyIsIm5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOztBQUVBO0FBQ0EsSUFBTUEsYUFBYSxHQUFHLEVBQXRCOztBQUVBLFNBQVNDLFdBQVQsR0FBeUM7QUFBQSxpRkFBZkQsYUFBZTs7QUFBQTtBQUFFOztBQUUzQyxJQUFNRSxFQUFFLGtpQkFBUjtBQWtCQSxJQUFNQyxFQUFFLEdBQUdELEVBQVg7ZUFFZTtBQUNiRSxFQUFBQSxJQUFJLEVBQUUsU0FETztBQUViRixFQUFBQSxFQUFFLEVBQUZBLEVBRmE7QUFHYkMsRUFBQUEsRUFBRSxFQUFGQSxFQUhhO0FBSWJGLEVBQUFBLFdBQVcsRUFBWEE7QUFKYSxDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gVE9ETyAtIHRoaXMgbW9kdWxlIGlzIGEgV0lQXG5cbi8qIGVzbGludC1kaXNhYmxlIGNhbWVsY2FzZSAqL1xuY29uc3QgSU5JVElBTF9TVEFURSA9IHt9O1xuXG5mdW5jdGlvbiBnZXRVbmlmb3Jtcyh7fSA9IElOSVRJQUxfU1RBVEUpIHt9XG5cbmNvbnN0IHZzID0gYFxcXG4vLyBOb3RlIC0gZmFpcmx5IGdlbmVyaWMsIG1vdmUgdG8gYSBVViBvciBzY3JlZW4gcGFja2FnZSwgb3IgZXZlbiBwcm9qZWN0P1xudmVjMiBwcm9qZWN0X2NsaXBzcGFjZV90b191dih2ZWM0IHBvc2l0aW9uKSB7XG4gIHZlYzIgcCA9IHZlYzIocG9zaXRpb24ueCAvIHBvc2l0aW9uLncsIHBvc2l0aW9uLnkgLyBwb3NpdGlvbi53KTtcbiAgcmV0dXJuIHZlYzIoKHAueCArIDEuMCkgLyAyLjAsIChwLnkgKyAxLjApIC8gMi4wKTtcbn1cblxudmVjMiBwcm9qZWN0X2NsaXBzcGFjZV90b19wcm9qZWN0aXZlX3V2KHZlYzQgcG9zaXRpb24pIHtcbiAgLy8gb3V0bGluZV92UG9zaXRpb24gPSBtYXQ0KFxuICAvLyAgIDAuNSwgMC4wLCAwLjAsIDAuMCxcbiAgLy8gICAwLjAsIDAuNSwgMC4wLCAwLjAsXG4gIC8vICAgMC4wLCAwLjAsIDAuNSwgMC4wLFxuICAvLyAgIDAuNSwgMC41LCAwLjUsIDEuMFxuICAvLyApICogcG9zaXRpb247XG4gIHJldHVybiB2ZWM0KHBvc2l0aW9uLnh5eiAqIDAuNSArIHBvc2l0aW9uLncgKiAwLjUsIHBvc2l0aW9uLncpO1xufVxuYDtcblxuY29uc3QgZnMgPSB2cztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBuYW1lOiAnb3V0bGluZScsXG4gIHZzLFxuICBmcyxcbiAgZ2V0VW5pZm9ybXMsXG59O1xuIl19