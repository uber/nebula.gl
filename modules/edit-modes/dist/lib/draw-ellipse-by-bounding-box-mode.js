"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DrawEllipseByBoundingBoxMode = void 0;

var _bboxPolygon = _interopRequireDefault(require("@turf/bbox-polygon"));

var _distance = _interopRequireDefault(require("@turf/distance"));

var _ellipse = _interopRequireDefault(require("@turf/ellipse"));

var _helpers = require("@turf/helpers");

var _geojsonEditMode = require("./geojson-edit-mode");

var _twoClickPolygonMode = require("./two-click-polygon-mode");

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

var DrawEllipseByBoundingBoxMode = /*#__PURE__*/function (_TwoClickPolygonMode) {
  _inherits(DrawEllipseByBoundingBoxMode, _TwoClickPolygonMode);

  var _super = _createSuper(DrawEllipseByBoundingBoxMode);

  function DrawEllipseByBoundingBoxMode() {
    _classCallCheck(this, DrawEllipseByBoundingBoxMode);

    return _super.apply(this, arguments);
  }

  _createClass(DrawEllipseByBoundingBoxMode, [{
    key: "getTwoClickPolygon",
    value: function getTwoClickPolygon(coord1, coord2, modeConfig) {
      var minX = Math.min(coord1[0], coord2[0]);
      var minY = Math.min(coord1[1], coord2[1]);
      var maxX = Math.max(coord1[0], coord2[0]);
      var maxY = Math.max(coord1[1], coord2[1]);
      var polygonPoints = (0, _bboxPolygon["default"])([minX, minY, maxX, maxY]).geometry.coordinates[0];
      var centerCoordinates = (0, _geojsonEditMode.getIntermediatePosition)(coord1, coord2);
      var xSemiAxis = Math.max((0, _distance["default"])((0, _helpers.point)(polygonPoints[0]), (0, _helpers.point)(polygonPoints[1])), 0.001);
      var ySemiAxis = Math.max((0, _distance["default"])((0, _helpers.point)(polygonPoints[0]), (0, _helpers.point)(polygonPoints[3])), 0.001); // @ts-ignore

      return (0, _ellipse["default"])(centerCoordinates, xSemiAxis, ySemiAxis);
    }
  }]);

  return DrawEllipseByBoundingBoxMode;
}(_twoClickPolygonMode.TwoClickPolygonMode);

exports.DrawEllipseByBoundingBoxMode = DrawEllipseByBoundingBoxMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvZHJhdy1lbGxpcHNlLWJ5LWJvdW5kaW5nLWJveC1tb2RlLnRzIl0sIm5hbWVzIjpbIkRyYXdFbGxpcHNlQnlCb3VuZGluZ0JveE1vZGUiLCJjb29yZDEiLCJjb29yZDIiLCJtb2RlQ29uZmlnIiwibWluWCIsIk1hdGgiLCJtaW4iLCJtaW5ZIiwibWF4WCIsIm1heCIsIm1heFkiLCJwb2x5Z29uUG9pbnRzIiwiZ2VvbWV0cnkiLCJjb29yZGluYXRlcyIsImNlbnRlckNvb3JkaW5hdGVzIiwieFNlbWlBeGlzIiwieVNlbWlBeGlzIiwiVHdvQ2xpY2tQb2x5Z29uTW9kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUVhQSw0Qjs7Ozs7Ozs7Ozs7Ozt1Q0FDUUMsTSxFQUFrQkMsTSxFQUFrQkMsVSxFQUFxQztBQUMxRixVQUFNQyxJQUFJLEdBQUdDLElBQUksQ0FBQ0MsR0FBTCxDQUFTTCxNQUFNLENBQUMsQ0FBRCxDQUFmLEVBQW9CQyxNQUFNLENBQUMsQ0FBRCxDQUExQixDQUFiO0FBQ0EsVUFBTUssSUFBSSxHQUFHRixJQUFJLENBQUNDLEdBQUwsQ0FBU0wsTUFBTSxDQUFDLENBQUQsQ0FBZixFQUFvQkMsTUFBTSxDQUFDLENBQUQsQ0FBMUIsQ0FBYjtBQUNBLFVBQU1NLElBQUksR0FBR0gsSUFBSSxDQUFDSSxHQUFMLENBQVNSLE1BQU0sQ0FBQyxDQUFELENBQWYsRUFBb0JDLE1BQU0sQ0FBQyxDQUFELENBQTFCLENBQWI7QUFDQSxVQUFNUSxJQUFJLEdBQUdMLElBQUksQ0FBQ0ksR0FBTCxDQUFTUixNQUFNLENBQUMsQ0FBRCxDQUFmLEVBQW9CQyxNQUFNLENBQUMsQ0FBRCxDQUExQixDQUFiO0FBRUEsVUFBTVMsYUFBYSxHQUFHLDZCQUFZLENBQUNQLElBQUQsRUFBT0csSUFBUCxFQUFhQyxJQUFiLEVBQW1CRSxJQUFuQixDQUFaLEVBQXNDRSxRQUF0QyxDQUErQ0MsV0FBL0MsQ0FBMkQsQ0FBM0QsQ0FBdEI7QUFDQSxVQUFNQyxpQkFBaUIsR0FBRyw4Q0FBd0JiLE1BQXhCLEVBQWdDQyxNQUFoQyxDQUExQjtBQUVBLFVBQU1hLFNBQVMsR0FBR1YsSUFBSSxDQUFDSSxHQUFMLENBQVMsMEJBQVMsb0JBQU1FLGFBQWEsQ0FBQyxDQUFELENBQW5CLENBQVQsRUFBa0Msb0JBQU1BLGFBQWEsQ0FBQyxDQUFELENBQW5CLENBQWxDLENBQVQsRUFBcUUsS0FBckUsQ0FBbEI7QUFDQSxVQUFNSyxTQUFTLEdBQUdYLElBQUksQ0FBQ0ksR0FBTCxDQUFTLDBCQUFTLG9CQUFNRSxhQUFhLENBQUMsQ0FBRCxDQUFuQixDQUFULEVBQWtDLG9CQUFNQSxhQUFhLENBQUMsQ0FBRCxDQUFuQixDQUFsQyxDQUFULEVBQXFFLEtBQXJFLENBQWxCLENBVjBGLENBWTFGOztBQUNBLGFBQU8seUJBQVFHLGlCQUFSLEVBQTJCQyxTQUEzQixFQUFzQ0MsU0FBdEMsQ0FBUDtBQUNEOzs7O0VBZitDQyx3QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBiYm94UG9seWdvbiBmcm9tICdAdHVyZi9iYm94LXBvbHlnb24nO1xuaW1wb3J0IGRpc3RhbmNlIGZyb20gJ0B0dXJmL2Rpc3RhbmNlJztcbmltcG9ydCBlbGxpcHNlIGZyb20gJ0B0dXJmL2VsbGlwc2UnO1xuaW1wb3J0IHsgcG9pbnQgfSBmcm9tICdAdHVyZi9oZWxwZXJzJztcbmltcG9ydCB7IFBvc2l0aW9uLCBQb2x5Z29uLCBGZWF0dXJlT2YgfSBmcm9tICcuLi9nZW9qc29uLXR5cGVzJztcbmltcG9ydCB7IGdldEludGVybWVkaWF0ZVBvc2l0aW9uIH0gZnJvbSAnLi9nZW9qc29uLWVkaXQtbW9kZSc7XG5pbXBvcnQgeyBUd29DbGlja1BvbHlnb25Nb2RlIH0gZnJvbSAnLi90d28tY2xpY2stcG9seWdvbi1tb2RlJztcblxuZXhwb3J0IGNsYXNzIERyYXdFbGxpcHNlQnlCb3VuZGluZ0JveE1vZGUgZXh0ZW5kcyBUd29DbGlja1BvbHlnb25Nb2RlIHtcbiAgZ2V0VHdvQ2xpY2tQb2x5Z29uKGNvb3JkMTogUG9zaXRpb24sIGNvb3JkMjogUG9zaXRpb24sIG1vZGVDb25maWc6IGFueSk6IEZlYXR1cmVPZjxQb2x5Z29uPiB7XG4gICAgY29uc3QgbWluWCA9IE1hdGgubWluKGNvb3JkMVswXSwgY29vcmQyWzBdKTtcbiAgICBjb25zdCBtaW5ZID0gTWF0aC5taW4oY29vcmQxWzFdLCBjb29yZDJbMV0pO1xuICAgIGNvbnN0IG1heFggPSBNYXRoLm1heChjb29yZDFbMF0sIGNvb3JkMlswXSk7XG4gICAgY29uc3QgbWF4WSA9IE1hdGgubWF4KGNvb3JkMVsxXSwgY29vcmQyWzFdKTtcblxuICAgIGNvbnN0IHBvbHlnb25Qb2ludHMgPSBiYm94UG9seWdvbihbbWluWCwgbWluWSwgbWF4WCwgbWF4WV0pLmdlb21ldHJ5LmNvb3JkaW5hdGVzWzBdO1xuICAgIGNvbnN0IGNlbnRlckNvb3JkaW5hdGVzID0gZ2V0SW50ZXJtZWRpYXRlUG9zaXRpb24oY29vcmQxLCBjb29yZDIpO1xuXG4gICAgY29uc3QgeFNlbWlBeGlzID0gTWF0aC5tYXgoZGlzdGFuY2UocG9pbnQocG9seWdvblBvaW50c1swXSksIHBvaW50KHBvbHlnb25Qb2ludHNbMV0pKSwgMC4wMDEpO1xuICAgIGNvbnN0IHlTZW1pQXhpcyA9IE1hdGgubWF4KGRpc3RhbmNlKHBvaW50KHBvbHlnb25Qb2ludHNbMF0pLCBwb2ludChwb2x5Z29uUG9pbnRzWzNdKSksIDAuMDAxKTtcblxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICByZXR1cm4gZWxsaXBzZShjZW50ZXJDb29yZGluYXRlcywgeFNlbWlBeGlzLCB5U2VtaUF4aXMpO1xuICB9XG59XG4iXX0=