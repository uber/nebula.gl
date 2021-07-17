"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DrawSquareFromCenterMode = void 0;

var _bboxPolygon = _interopRequireDefault(require("@turf/bbox-polygon"));

var _distance = _interopRequireDefault(require("@turf/distance"));

var _along = _interopRequireDefault(require("@turf/along"));

var _helpers = require("@turf/helpers");

var _twoClickPolygonMode = require("./two-click-polygon-mode");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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

var DrawSquareFromCenterMode = /*#__PURE__*/function (_TwoClickPolygonMode) {
  _inherits(DrawSquareFromCenterMode, _TwoClickPolygonMode);

  var _super = _createSuper(DrawSquareFromCenterMode);

  function DrawSquareFromCenterMode() {
    _classCallCheck(this, DrawSquareFromCenterMode);

    return _super.apply(this, arguments);
  }

  _createClass(DrawSquareFromCenterMode, [{
    key: "getTwoClickPolygon",
    value: function getTwoClickPolygon(coord1, coord2, modeConfig) {
      // get the coordinates of the other two rectangle vertices
      var coord3 = [coord2[0], coord1[1]];
      var coord4 = [coord1[0], coord2[1]]; // determine the shortest distance to the origin, which will be the length of each square side

      var distance1 = (0, _distance["default"])((0, _helpers.point)(coord3), (0, _helpers.point)(coord1));
      var distance2 = (0, _distance["default"])((0, _helpers.point)(coord4), (0, _helpers.point)(coord1));
      var shortestDistance = distance1 <= distance2 ? distance1 : distance2; // determine which coordinate pair of the two is closest to the origin

      var closestPoint = distance1 <= distance2 ? coord3 : coord4; // create a linestring which will used to locate the second square vertex

      var line = (0, _helpers.lineString)([closestPoint, coord2]); // get the coordinates of the second square vertex

      var newPoint = (0, _along["default"])(line, shortestDistance);
      var corner = newPoint.geometry.coordinates; // determine the longitude and latitude values of the opposite corner

      var longitude = coord1[0] > corner[0] ? coord1[0] + Math.abs(coord1[0] - corner[0]) : coord1[0] - Math.abs(coord1[0] - corner[0]);
      var latitude = coord1[1] > corner[1] ? coord1[1] + Math.abs(coord1[1] - corner[1]) : coord1[1] - Math.abs(coord1[1] - corner[1]);
      var square = (0, _bboxPolygon["default"])([longitude, latitude, corner[0], corner[1]]);
      square.properties = square.properties || {};
      square.properties.shape = 'Square'; // @ts-ignore

      return square;
    }
  }]);

  return DrawSquareFromCenterMode;
}(_twoClickPolygonMode.TwoClickPolygonMode);

exports.DrawSquareFromCenterMode = DrawSquareFromCenterMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvZHJhdy1zcXVhcmUtZnJvbS1jZW50ZXItbW9kZS50cyJdLCJuYW1lcyI6WyJEcmF3U3F1YXJlRnJvbUNlbnRlck1vZGUiLCJjb29yZDEiLCJjb29yZDIiLCJtb2RlQ29uZmlnIiwiY29vcmQzIiwiY29vcmQ0IiwiZGlzdGFuY2UxIiwiZGlzdGFuY2UyIiwic2hvcnRlc3REaXN0YW5jZSIsImNsb3Nlc3RQb2ludCIsImxpbmUiLCJuZXdQb2ludCIsImNvcm5lciIsImdlb21ldHJ5IiwiY29vcmRpbmF0ZXMiLCJsb25naXR1ZGUiLCJNYXRoIiwiYWJzIiwibGF0aXR1ZGUiLCJzcXVhcmUiLCJwcm9wZXJ0aWVzIiwic2hhcGUiLCJUd29DbGlja1BvbHlnb25Nb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRWFBLHdCOzs7Ozs7Ozs7Ozs7O3VDQUNRQyxNLEVBQWtCQyxNLEVBQWtCQyxVLEVBQXFDO0FBQzFGO0FBQ0EsVUFBTUMsTUFBTSxHQUFHLENBQUNGLE1BQU0sQ0FBQyxDQUFELENBQVAsRUFBWUQsTUFBTSxDQUFDLENBQUQsQ0FBbEIsQ0FBZjtBQUNBLFVBQU1JLE1BQU0sR0FBRyxDQUFDSixNQUFNLENBQUMsQ0FBRCxDQUFQLEVBQVlDLE1BQU0sQ0FBQyxDQUFELENBQWxCLENBQWYsQ0FIMEYsQ0FLMUY7O0FBQ0EsVUFBTUksU0FBUyxHQUFHLDBCQUFhLG9CQUFNRixNQUFOLENBQWIsRUFBNEIsb0JBQU1ILE1BQU4sQ0FBNUIsQ0FBbEI7QUFDQSxVQUFNTSxTQUFTLEdBQUcsMEJBQWEsb0JBQU1GLE1BQU4sQ0FBYixFQUE0QixvQkFBTUosTUFBTixDQUE1QixDQUFsQjtBQUNBLFVBQU1PLGdCQUFnQixHQUFHRixTQUFTLElBQUlDLFNBQWIsR0FBeUJELFNBQXpCLEdBQXFDQyxTQUE5RCxDQVIwRixDQVUxRjs7QUFDQSxVQUFNRSxZQUFZLEdBQUdILFNBQVMsSUFBSUMsU0FBYixHQUF5QkgsTUFBekIsR0FBa0NDLE1BQXZELENBWDBGLENBYTFGOztBQUNBLFVBQU1LLElBQUksR0FBRyx5QkFBZSxDQUFDRCxZQUFELEVBQWVQLE1BQWYsQ0FBZixDQUFiLENBZDBGLENBZ0IxRjs7QUFDQSxVQUFNUyxRQUFRLEdBQUcsdUJBQVVELElBQVYsRUFBZ0JGLGdCQUFoQixDQUFqQjtBQUNBLFVBQU1JLE1BQU0sR0FBR0QsUUFBUSxDQUFDRSxRQUFULENBQWtCQyxXQUFqQyxDQWxCMEYsQ0FvQjFGOztBQUNBLFVBQU1DLFNBQVMsR0FDYmQsTUFBTSxDQUFDLENBQUQsQ0FBTixHQUFZVyxNQUFNLENBQUMsQ0FBRCxDQUFsQixHQUNJWCxNQUFNLENBQUMsQ0FBRCxDQUFOLEdBQVllLElBQUksQ0FBQ0MsR0FBTCxDQUFTaEIsTUFBTSxDQUFDLENBQUQsQ0FBTixHQUFZVyxNQUFNLENBQUMsQ0FBRCxDQUEzQixDQURoQixHQUVJWCxNQUFNLENBQUMsQ0FBRCxDQUFOLEdBQVllLElBQUksQ0FBQ0MsR0FBTCxDQUFTaEIsTUFBTSxDQUFDLENBQUQsQ0FBTixHQUFZVyxNQUFNLENBQUMsQ0FBRCxDQUEzQixDQUhsQjtBQUlBLFVBQU1NLFFBQVEsR0FDWmpCLE1BQU0sQ0FBQyxDQUFELENBQU4sR0FBWVcsTUFBTSxDQUFDLENBQUQsQ0FBbEIsR0FDSVgsTUFBTSxDQUFDLENBQUQsQ0FBTixHQUFZZSxJQUFJLENBQUNDLEdBQUwsQ0FBU2hCLE1BQU0sQ0FBQyxDQUFELENBQU4sR0FBWVcsTUFBTSxDQUFDLENBQUQsQ0FBM0IsQ0FEaEIsR0FFSVgsTUFBTSxDQUFDLENBQUQsQ0FBTixHQUFZZSxJQUFJLENBQUNDLEdBQUwsQ0FBU2hCLE1BQU0sQ0FBQyxDQUFELENBQU4sR0FBWVcsTUFBTSxDQUFDLENBQUQsQ0FBM0IsQ0FIbEI7QUFLQSxVQUFNTyxNQUFNLEdBQUcsNkJBQVksQ0FBQ0osU0FBRCxFQUFZRyxRQUFaLEVBQXNCTixNQUFNLENBQUMsQ0FBRCxDQUE1QixFQUFpQ0EsTUFBTSxDQUFDLENBQUQsQ0FBdkMsQ0FBWixDQUFmO0FBQ0FPLE1BQUFBLE1BQU0sQ0FBQ0MsVUFBUCxHQUFvQkQsTUFBTSxDQUFDQyxVQUFQLElBQXFCLEVBQXpDO0FBQ0FELE1BQUFBLE1BQU0sQ0FBQ0MsVUFBUCxDQUFrQkMsS0FBbEIsR0FBMEIsUUFBMUIsQ0FoQzBGLENBa0MxRjs7QUFDQSxhQUFPRixNQUFQO0FBQ0Q7Ozs7RUFyQzJDRyx3QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBiYm94UG9seWdvbiBmcm9tICdAdHVyZi9iYm94LXBvbHlnb24nO1xuaW1wb3J0IHR1cmZEaXN0YW5jZSBmcm9tICdAdHVyZi9kaXN0YW5jZSc7XG5pbXBvcnQgdHVyZkFsb25nIGZyb20gJ0B0dXJmL2Fsb25nJztcbmltcG9ydCB7IHBvaW50LCBsaW5lU3RyaW5nIGFzIHR1cmZMaW5lU3RyaW5nIH0gZnJvbSAnQHR1cmYvaGVscGVycyc7XG5pbXBvcnQgeyBQb3NpdGlvbiwgUG9seWdvbiwgRmVhdHVyZU9mIH0gZnJvbSAnLi4vZ2VvanNvbi10eXBlcyc7XG5pbXBvcnQgeyBUd29DbGlja1BvbHlnb25Nb2RlIH0gZnJvbSAnLi90d28tY2xpY2stcG9seWdvbi1tb2RlJztcblxuZXhwb3J0IGNsYXNzIERyYXdTcXVhcmVGcm9tQ2VudGVyTW9kZSBleHRlbmRzIFR3b0NsaWNrUG9seWdvbk1vZGUge1xuICBnZXRUd29DbGlja1BvbHlnb24oY29vcmQxOiBQb3NpdGlvbiwgY29vcmQyOiBQb3NpdGlvbiwgbW9kZUNvbmZpZzogYW55KTogRmVhdHVyZU9mPFBvbHlnb24+IHtcbiAgICAvLyBnZXQgdGhlIGNvb3JkaW5hdGVzIG9mIHRoZSBvdGhlciB0d28gcmVjdGFuZ2xlIHZlcnRpY2VzXG4gICAgY29uc3QgY29vcmQzID0gW2Nvb3JkMlswXSwgY29vcmQxWzFdXTtcbiAgICBjb25zdCBjb29yZDQgPSBbY29vcmQxWzBdLCBjb29yZDJbMV1dO1xuXG4gICAgLy8gZGV0ZXJtaW5lIHRoZSBzaG9ydGVzdCBkaXN0YW5jZSB0byB0aGUgb3JpZ2luLCB3aGljaCB3aWxsIGJlIHRoZSBsZW5ndGggb2YgZWFjaCBzcXVhcmUgc2lkZVxuICAgIGNvbnN0IGRpc3RhbmNlMSA9IHR1cmZEaXN0YW5jZShwb2ludChjb29yZDMpLCBwb2ludChjb29yZDEpKTtcbiAgICBjb25zdCBkaXN0YW5jZTIgPSB0dXJmRGlzdGFuY2UocG9pbnQoY29vcmQ0KSwgcG9pbnQoY29vcmQxKSk7XG4gICAgY29uc3Qgc2hvcnRlc3REaXN0YW5jZSA9IGRpc3RhbmNlMSA8PSBkaXN0YW5jZTIgPyBkaXN0YW5jZTEgOiBkaXN0YW5jZTI7XG5cbiAgICAvLyBkZXRlcm1pbmUgd2hpY2ggY29vcmRpbmF0ZSBwYWlyIG9mIHRoZSB0d28gaXMgY2xvc2VzdCB0byB0aGUgb3JpZ2luXG4gICAgY29uc3QgY2xvc2VzdFBvaW50ID0gZGlzdGFuY2UxIDw9IGRpc3RhbmNlMiA/IGNvb3JkMyA6IGNvb3JkNDtcblxuICAgIC8vIGNyZWF0ZSBhIGxpbmVzdHJpbmcgd2hpY2ggd2lsbCB1c2VkIHRvIGxvY2F0ZSB0aGUgc2Vjb25kIHNxdWFyZSB2ZXJ0ZXhcbiAgICBjb25zdCBsaW5lID0gdHVyZkxpbmVTdHJpbmcoW2Nsb3Nlc3RQb2ludCwgY29vcmQyXSk7XG5cbiAgICAvLyBnZXQgdGhlIGNvb3JkaW5hdGVzIG9mIHRoZSBzZWNvbmQgc3F1YXJlIHZlcnRleFxuICAgIGNvbnN0IG5ld1BvaW50ID0gdHVyZkFsb25nKGxpbmUsIHNob3J0ZXN0RGlzdGFuY2UpO1xuICAgIGNvbnN0IGNvcm5lciA9IG5ld1BvaW50Lmdlb21ldHJ5LmNvb3JkaW5hdGVzO1xuXG4gICAgLy8gZGV0ZXJtaW5lIHRoZSBsb25naXR1ZGUgYW5kIGxhdGl0dWRlIHZhbHVlcyBvZiB0aGUgb3Bwb3NpdGUgY29ybmVyXG4gICAgY29uc3QgbG9uZ2l0dWRlID1cbiAgICAgIGNvb3JkMVswXSA+IGNvcm5lclswXVxuICAgICAgICA/IGNvb3JkMVswXSArIE1hdGguYWJzKGNvb3JkMVswXSAtIGNvcm5lclswXSlcbiAgICAgICAgOiBjb29yZDFbMF0gLSBNYXRoLmFicyhjb29yZDFbMF0gLSBjb3JuZXJbMF0pO1xuICAgIGNvbnN0IGxhdGl0dWRlID1cbiAgICAgIGNvb3JkMVsxXSA+IGNvcm5lclsxXVxuICAgICAgICA/IGNvb3JkMVsxXSArIE1hdGguYWJzKGNvb3JkMVsxXSAtIGNvcm5lclsxXSlcbiAgICAgICAgOiBjb29yZDFbMV0gLSBNYXRoLmFicyhjb29yZDFbMV0gLSBjb3JuZXJbMV0pO1xuXG4gICAgY29uc3Qgc3F1YXJlID0gYmJveFBvbHlnb24oW2xvbmdpdHVkZSwgbGF0aXR1ZGUsIGNvcm5lclswXSwgY29ybmVyWzFdXSk7XG4gICAgc3F1YXJlLnByb3BlcnRpZXMgPSBzcXVhcmUucHJvcGVydGllcyB8fCB7fTtcbiAgICBzcXVhcmUucHJvcGVydGllcy5zaGFwZSA9ICdTcXVhcmUnO1xuXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHJldHVybiBzcXVhcmU7XG4gIH1cbn1cbiJdfQ==