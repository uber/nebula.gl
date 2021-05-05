"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DrawEllipseUsingThreePointsMode = void 0;

var _distance = _interopRequireDefault(require("@turf/distance"));

var _ellipse = _interopRequireDefault(require("@turf/ellipse"));

var _bearing = _interopRequireDefault(require("@turf/bearing"));

var _helpers = require("@turf/helpers");

var _geojsonEditMode = require("./geojson-edit-mode");

var _threeClickPolygonMode = require("./three-click-polygon-mode");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var DrawEllipseUsingThreePointsMode = /*#__PURE__*/function (_ThreeClickPolygonMod) {
  _inherits(DrawEllipseUsingThreePointsMode, _ThreeClickPolygonMod);

  var _super = _createSuper(DrawEllipseUsingThreePointsMode);

  function DrawEllipseUsingThreePointsMode() {
    _classCallCheck(this, DrawEllipseUsingThreePointsMode);

    return _super.apply(this, arguments);
  }

  _createClass(DrawEllipseUsingThreePointsMode, [{
    key: "getThreeClickPolygon",
    value: function getThreeClickPolygon(coord1, coord2, coord3, modeConfig) {
      var centerCoordinates = (0, _geojsonEditMode.getIntermediatePosition)(coord1, coord2);
      var xSemiAxis = Math.max((0, _distance["default"])(centerCoordinates, (0, _helpers.point)(coord3)), 0.001);
      var ySemiAxis = Math.max((0, _distance["default"])(coord1, coord2), 0.001) / 2;
      var options = {
        angle: (0, _bearing["default"])(coord1, coord2)
      }; // @ts-ignore

      return (0, _ellipse["default"])(centerCoordinates, xSemiAxis, ySemiAxis, options);
    }
  }]);

  return DrawEllipseUsingThreePointsMode;
}(_threeClickPolygonMode.ThreeClickPolygonMode);

exports.DrawEllipseUsingThreePointsMode = DrawEllipseUsingThreePointsMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvZHJhdy1lbGxpcHNlLXVzaW5nLXRocmVlLXBvaW50cy1tb2RlLnRzIl0sIm5hbWVzIjpbIkRyYXdFbGxpcHNlVXNpbmdUaHJlZVBvaW50c01vZGUiLCJjb29yZDEiLCJjb29yZDIiLCJjb29yZDMiLCJtb2RlQ29uZmlnIiwiY2VudGVyQ29vcmRpbmF0ZXMiLCJ4U2VtaUF4aXMiLCJNYXRoIiwibWF4IiwieVNlbWlBeGlzIiwib3B0aW9ucyIsImFuZ2xlIiwiVGhyZWVDbGlja1BvbHlnb25Nb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRWFBLCtCOzs7Ozs7Ozs7Ozs7O3lDQUVUQyxNLEVBQ0FDLE0sRUFDQUMsTSxFQUNBQyxVLEVBQ3VDO0FBQ3ZDLFVBQU1DLGlCQUFpQixHQUFHLDhDQUF3QkosTUFBeEIsRUFBZ0NDLE1BQWhDLENBQTFCO0FBQ0EsVUFBTUksU0FBUyxHQUFHQyxJQUFJLENBQUNDLEdBQUwsQ0FBUywwQkFBU0gsaUJBQVQsRUFBNEIsb0JBQU1GLE1BQU4sQ0FBNUIsQ0FBVCxFQUFxRCxLQUFyRCxDQUFsQjtBQUNBLFVBQU1NLFNBQVMsR0FBR0YsSUFBSSxDQUFDQyxHQUFMLENBQVMsMEJBQVNQLE1BQVQsRUFBaUJDLE1BQWpCLENBQVQsRUFBbUMsS0FBbkMsSUFBNEMsQ0FBOUQ7QUFDQSxVQUFNUSxPQUFPLEdBQUc7QUFBRUMsUUFBQUEsS0FBSyxFQUFFLHlCQUFRVixNQUFSLEVBQWdCQyxNQUFoQjtBQUFULE9BQWhCLENBSnVDLENBS3ZDOztBQUNBLGFBQU8seUJBQVFHLGlCQUFSLEVBQTJCQyxTQUEzQixFQUFzQ0csU0FBdEMsRUFBaURDLE9BQWpELENBQVA7QUFDRDs7OztFQWJrREUsNEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZGlzdGFuY2UgZnJvbSAnQHR1cmYvZGlzdGFuY2UnO1xuaW1wb3J0IGVsbGlwc2UgZnJvbSAnQHR1cmYvZWxsaXBzZSc7XG5pbXBvcnQgYmVhcmluZyBmcm9tICdAdHVyZi9iZWFyaW5nJztcbmltcG9ydCB7IHBvaW50IH0gZnJvbSAnQHR1cmYvaGVscGVycyc7XG5pbXBvcnQgeyBQb3NpdGlvbiwgUG9seWdvbiwgRmVhdHVyZU9mIH0gZnJvbSAnLi4vZ2VvanNvbi10eXBlcyc7XG5pbXBvcnQgeyBnZXRJbnRlcm1lZGlhdGVQb3NpdGlvbiB9IGZyb20gJy4vZ2VvanNvbi1lZGl0LW1vZGUnO1xuaW1wb3J0IHsgVGhyZWVDbGlja1BvbHlnb25Nb2RlIH0gZnJvbSAnLi90aHJlZS1jbGljay1wb2x5Z29uLW1vZGUnO1xuXG5leHBvcnQgY2xhc3MgRHJhd0VsbGlwc2VVc2luZ1RocmVlUG9pbnRzTW9kZSBleHRlbmRzIFRocmVlQ2xpY2tQb2x5Z29uTW9kZSB7XG4gIGdldFRocmVlQ2xpY2tQb2x5Z29uKFxuICAgIGNvb3JkMTogUG9zaXRpb24sXG4gICAgY29vcmQyOiBQb3NpdGlvbixcbiAgICBjb29yZDM6IFBvc2l0aW9uLFxuICAgIG1vZGVDb25maWc6IGFueVxuICApOiBGZWF0dXJlT2Y8UG9seWdvbj4gfCBudWxsIHwgdW5kZWZpbmVkIHtcbiAgICBjb25zdCBjZW50ZXJDb29yZGluYXRlcyA9IGdldEludGVybWVkaWF0ZVBvc2l0aW9uKGNvb3JkMSwgY29vcmQyKTtcbiAgICBjb25zdCB4U2VtaUF4aXMgPSBNYXRoLm1heChkaXN0YW5jZShjZW50ZXJDb29yZGluYXRlcywgcG9pbnQoY29vcmQzKSksIDAuMDAxKTtcbiAgICBjb25zdCB5U2VtaUF4aXMgPSBNYXRoLm1heChkaXN0YW5jZShjb29yZDEsIGNvb3JkMiksIDAuMDAxKSAvIDI7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHsgYW5nbGU6IGJlYXJpbmcoY29vcmQxLCBjb29yZDIpIH07XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHJldHVybiBlbGxpcHNlKGNlbnRlckNvb3JkaW5hdGVzLCB4U2VtaUF4aXMsIHlTZW1pQXhpcywgb3B0aW9ucyk7XG4gIH1cbn1cbiJdfQ==