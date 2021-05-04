"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _core = require("@luma.gl/core");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Arrow2DGeometry = /*#__PURE__*/function (_Geometry) {
  _inherits(Arrow2DGeometry, _Geometry);

  var _super = _createSuper(Arrow2DGeometry);

  function Arrow2DGeometry() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Arrow2DGeometry);

    return _super.call(this, Object.assign({}, opts, {
      attributes: getArrowAttributes(opts)
    }));
  }

  return Arrow2DGeometry;
}(_core.Geometry);

exports["default"] = Arrow2DGeometry;

function getArrowAttributes(_ref) {
  var _ref$length = _ref.length,
      length = _ref$length === void 0 ? 1 : _ref$length,
      _ref$headSize = _ref.headSize,
      headSize = _ref$headSize === void 0 ? 0.2 : _ref$headSize,
      _ref$tailWidth = _ref.tailWidth,
      tailWidth = _ref$tailWidth === void 0 ? 0.05 : _ref$tailWidth,
      _ref$tailStart = _ref.tailStart,
      tailStart = _ref$tailStart === void 0 ? 0.05 : _ref$tailStart;
  var texCoords = [// HEAD
  0.5, 1.0, 0, 0.5 - headSize / 2, 1.0 - headSize, 0, 0.5 + headSize / 2, 1.0 - headSize, 0, 0.5 - tailWidth / 2, tailStart, 0, 0.5 + tailWidth / 2, 1.0 - headSize, 0, 0.5 + tailWidth / 2, tailStart, 0, 0.5 - tailWidth / 2, tailStart, 0, 0.5 - tailWidth / 2, 1.0 - headSize, 0, 0.5 + tailWidth / 2, 1.0 - headSize, 0];
  var normals = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1]; // Center and scale

  var positions = new Array(texCoords.length);

  for (var i = 0; i < texCoords.length / 3; i++) {
    var i3 = i * 3;
    positions[i3 + 0] = (texCoords[i3 + 0] - 0.5) * length;
    positions[i3 + 1] = (texCoords[i3 + 1] - 0.5) * length;
    positions[i3 + 2] = 0;
  }

  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    texCoords: new Float32Array(texCoords)
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvcGF0aC1tYXJrZXItbGF5ZXIvYXJyb3ctMmQtZ2VvbWV0cnkudHMiXSwibmFtZXMiOlsiQXJyb3cyREdlb21ldHJ5Iiwib3B0cyIsIk9iamVjdCIsImFzc2lnbiIsImF0dHJpYnV0ZXMiLCJnZXRBcnJvd0F0dHJpYnV0ZXMiLCJHZW9tZXRyeSIsImxlbmd0aCIsImhlYWRTaXplIiwidGFpbFdpZHRoIiwidGFpbFN0YXJ0IiwidGV4Q29vcmRzIiwibm9ybWFscyIsInBvc2l0aW9ucyIsIkFycmF5IiwiaSIsImkzIiwiRmxvYXQzMkFycmF5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRXFCQSxlOzs7OztBQUNuQiw2QkFBdUI7QUFBQSxRQUFYQyxJQUFXLHVFQUFKLEVBQUk7O0FBQUE7O0FBQUEsNkJBRW5CQyxNQUFNLENBQUNDLE1BQVAsQ0FBYyxFQUFkLEVBQWtCRixJQUFsQixFQUF3QjtBQUN0QkcsTUFBQUEsVUFBVSxFQUFFQyxrQkFBa0IsQ0FBQ0osSUFBRDtBQURSLEtBQXhCLENBRm1CO0FBTXRCOzs7RUFQMENLLGM7Ozs7QUFVN0MsU0FBU0Qsa0JBQVQsT0FBZ0c7QUFBQSx5QkFBbEVFLE1BQWtFO0FBQUEsTUFBbEVBLE1BQWtFLDRCQUF6RCxDQUF5RDtBQUFBLDJCQUF0REMsUUFBc0Q7QUFBQSxNQUF0REEsUUFBc0QsOEJBQTNDLEdBQTJDO0FBQUEsNEJBQXRDQyxTQUFzQztBQUFBLE1BQXRDQSxTQUFzQywrQkFBMUIsSUFBMEI7QUFBQSw0QkFBcEJDLFNBQW9CO0FBQUEsTUFBcEJBLFNBQW9CLCtCQUFSLElBQVE7QUFDOUYsTUFBTUMsU0FBUyxHQUFHLENBQ2hCO0FBQ0EsS0FGZ0IsRUFHaEIsR0FIZ0IsRUFJaEIsQ0FKZ0IsRUFLaEIsTUFBTUgsUUFBUSxHQUFHLENBTEQsRUFNaEIsTUFBTUEsUUFOVSxFQU9oQixDQVBnQixFQVFoQixNQUFNQSxRQUFRLEdBQUcsQ0FSRCxFQVNoQixNQUFNQSxRQVRVLEVBVWhCLENBVmdCLEVBV2hCLE1BQU1DLFNBQVMsR0FBRyxDQVhGLEVBWWhCQyxTQVpnQixFQWFoQixDQWJnQixFQWNoQixNQUFNRCxTQUFTLEdBQUcsQ0FkRixFQWVoQixNQUFNRCxRQWZVLEVBZ0JoQixDQWhCZ0IsRUFpQmhCLE1BQU1DLFNBQVMsR0FBRyxDQWpCRixFQWtCaEJDLFNBbEJnQixFQW1CaEIsQ0FuQmdCLEVBb0JoQixNQUFNRCxTQUFTLEdBQUcsQ0FwQkYsRUFxQmhCQyxTQXJCZ0IsRUFzQmhCLENBdEJnQixFQXVCaEIsTUFBTUQsU0FBUyxHQUFHLENBdkJGLEVBd0JoQixNQUFNRCxRQXhCVSxFQXlCaEIsQ0F6QmdCLEVBMEJoQixNQUFNQyxTQUFTLEdBQUcsQ0ExQkYsRUEyQmhCLE1BQU1ELFFBM0JVLEVBNEJoQixDQTVCZ0IsQ0FBbEI7QUErQkEsTUFBTUksT0FBTyxHQUFHLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkIsRUFBc0IsQ0FBdEIsRUFBeUIsQ0FBekIsRUFBNEIsQ0FBNUIsRUFBK0IsQ0FBL0IsRUFBa0MsQ0FBbEMsRUFBcUMsQ0FBckMsRUFBd0MsQ0FBeEMsRUFBMkMsQ0FBM0MsRUFBOEMsQ0FBOUMsRUFBaUQsQ0FBakQsRUFBb0QsQ0FBcEQsRUFBdUQsQ0FBdkQsRUFBMEQsQ0FBMUQsRUFBNkQsQ0FBN0QsRUFBZ0UsQ0FBaEUsRUFBbUUsQ0FBbkUsRUFBc0UsQ0FBdEUsRUFBeUUsQ0FBekUsRUFBNEUsQ0FBNUUsRUFBK0UsQ0FBL0UsQ0FBaEIsQ0FoQzhGLENBa0M5Rjs7QUFDQSxNQUFNQyxTQUFTLEdBQUcsSUFBSUMsS0FBSixDQUFVSCxTQUFTLENBQUNKLE1BQXBCLENBQWxCOztBQUNBLE9BQUssSUFBSVEsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0osU0FBUyxDQUFDSixNQUFWLEdBQW1CLENBQXZDLEVBQTBDUSxDQUFDLEVBQTNDLEVBQStDO0FBQzdDLFFBQU1DLEVBQUUsR0FBR0QsQ0FBQyxHQUFHLENBQWY7QUFDQUYsSUFBQUEsU0FBUyxDQUFDRyxFQUFFLEdBQUcsQ0FBTixDQUFULEdBQW9CLENBQUNMLFNBQVMsQ0FBQ0ssRUFBRSxHQUFHLENBQU4sQ0FBVCxHQUFvQixHQUFyQixJQUE0QlQsTUFBaEQ7QUFDQU0sSUFBQUEsU0FBUyxDQUFDRyxFQUFFLEdBQUcsQ0FBTixDQUFULEdBQW9CLENBQUNMLFNBQVMsQ0FBQ0ssRUFBRSxHQUFHLENBQU4sQ0FBVCxHQUFvQixHQUFyQixJQUE0QlQsTUFBaEQ7QUFDQU0sSUFBQUEsU0FBUyxDQUFDRyxFQUFFLEdBQUcsQ0FBTixDQUFULEdBQW9CLENBQXBCO0FBQ0Q7O0FBQ0QsU0FBTztBQUNMSCxJQUFBQSxTQUFTLEVBQUUsSUFBSUksWUFBSixDQUFpQkosU0FBakIsQ0FETjtBQUVMRCxJQUFBQSxPQUFPLEVBQUUsSUFBSUssWUFBSixDQUFpQkwsT0FBakIsQ0FGSjtBQUdMRCxJQUFBQSxTQUFTLEVBQUUsSUFBSU0sWUFBSixDQUFpQk4sU0FBakI7QUFITixHQUFQO0FBS0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBHZW9tZXRyeSB9IGZyb20gJ0BsdW1hLmdsL2NvcmUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBcnJvdzJER2VvbWV0cnkgZXh0ZW5kcyBHZW9tZXRyeSB7XG4gIGNvbnN0cnVjdG9yKG9wdHMgPSB7fSkge1xuICAgIHN1cGVyKFxuICAgICAgT2JqZWN0LmFzc2lnbih7fSwgb3B0cywge1xuICAgICAgICBhdHRyaWJ1dGVzOiBnZXRBcnJvd0F0dHJpYnV0ZXMob3B0cyksXG4gICAgICB9KVxuICAgICk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0QXJyb3dBdHRyaWJ1dGVzKHsgbGVuZ3RoID0gMSwgaGVhZFNpemUgPSAwLjIsIHRhaWxXaWR0aCA9IDAuMDUsIHRhaWxTdGFydCA9IDAuMDUgfSkge1xuICBjb25zdCB0ZXhDb29yZHMgPSBbXG4gICAgLy8gSEVBRFxuICAgIDAuNSxcbiAgICAxLjAsXG4gICAgMCxcbiAgICAwLjUgLSBoZWFkU2l6ZSAvIDIsXG4gICAgMS4wIC0gaGVhZFNpemUsXG4gICAgMCxcbiAgICAwLjUgKyBoZWFkU2l6ZSAvIDIsXG4gICAgMS4wIC0gaGVhZFNpemUsXG4gICAgMCxcbiAgICAwLjUgLSB0YWlsV2lkdGggLyAyLFxuICAgIHRhaWxTdGFydCxcbiAgICAwLFxuICAgIDAuNSArIHRhaWxXaWR0aCAvIDIsXG4gICAgMS4wIC0gaGVhZFNpemUsXG4gICAgMCxcbiAgICAwLjUgKyB0YWlsV2lkdGggLyAyLFxuICAgIHRhaWxTdGFydCxcbiAgICAwLFxuICAgIDAuNSAtIHRhaWxXaWR0aCAvIDIsXG4gICAgdGFpbFN0YXJ0LFxuICAgIDAsXG4gICAgMC41IC0gdGFpbFdpZHRoIC8gMixcbiAgICAxLjAgLSBoZWFkU2l6ZSxcbiAgICAwLFxuICAgIDAuNSArIHRhaWxXaWR0aCAvIDIsXG4gICAgMS4wIC0gaGVhZFNpemUsXG4gICAgMCxcbiAgXTtcblxuICBjb25zdCBub3JtYWxzID0gWzAsIDAsIDEsIDAsIDAsIDEsIDAsIDAsIDEsIDAsIDAsIDEsIDAsIDAsIDEsIDAsIDAsIDEsIDAsIDAsIDEsIDAsIDAsIDEsIDAsIDAsIDFdO1xuXG4gIC8vIENlbnRlciBhbmQgc2NhbGVcbiAgY29uc3QgcG9zaXRpb25zID0gbmV3IEFycmF5KHRleENvb3Jkcy5sZW5ndGgpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHRleENvb3Jkcy5sZW5ndGggLyAzOyBpKyspIHtcbiAgICBjb25zdCBpMyA9IGkgKiAzO1xuICAgIHBvc2l0aW9uc1tpMyArIDBdID0gKHRleENvb3Jkc1tpMyArIDBdIC0gMC41KSAqIGxlbmd0aDtcbiAgICBwb3NpdGlvbnNbaTMgKyAxXSA9ICh0ZXhDb29yZHNbaTMgKyAxXSAtIDAuNSkgKiBsZW5ndGg7XG4gICAgcG9zaXRpb25zW2kzICsgMl0gPSAwO1xuICB9XG4gIHJldHVybiB7XG4gICAgcG9zaXRpb25zOiBuZXcgRmxvYXQzMkFycmF5KHBvc2l0aW9ucyksXG4gICAgbm9ybWFsczogbmV3IEZsb2F0MzJBcnJheShub3JtYWxzKSxcbiAgICB0ZXhDb29yZHM6IG5ldyBGbG9hdDMyQXJyYXkodGV4Q29vcmRzKSxcbiAgfTtcbn1cbiJdfQ==