"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DrawRectangleMode = void 0;

var _bboxPolygon = _interopRequireDefault(require("@turf/bbox-polygon"));

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

var DrawRectangleMode = /*#__PURE__*/function (_TwoClickPolygonMode) {
  _inherits(DrawRectangleMode, _TwoClickPolygonMode);

  var _super = _createSuper(DrawRectangleMode);

  function DrawRectangleMode() {
    _classCallCheck(this, DrawRectangleMode);

    return _super.apply(this, arguments);
  }

  _createClass(DrawRectangleMode, [{
    key: "getTwoClickPolygon",
    value: function getTwoClickPolygon(coord1, coord2, modeConfig) {
      var rectangle = (0, _bboxPolygon["default"])([coord1[0], coord1[1], coord2[0], coord2[1]]);
      rectangle.properties = rectangle.properties || {};
      rectangle.properties.shape = 'Rectangle'; // @ts-ignore

      return rectangle;
    }
  }]);

  return DrawRectangleMode;
}(_twoClickPolygonMode.TwoClickPolygonMode);

exports.DrawRectangleMode = DrawRectangleMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvZHJhdy1yZWN0YW5nbGUtbW9kZS50cyJdLCJuYW1lcyI6WyJEcmF3UmVjdGFuZ2xlTW9kZSIsImNvb3JkMSIsImNvb3JkMiIsIm1vZGVDb25maWciLCJyZWN0YW5nbGUiLCJwcm9wZXJ0aWVzIiwic2hhcGUiLCJUd29DbGlja1BvbHlnb25Nb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRWFBLGlCOzs7Ozs7Ozs7Ozs7O3VDQUNRQyxNLEVBQWtCQyxNLEVBQWtCQyxVLEVBQXFDO0FBQzFGLFVBQU1DLFNBQVMsR0FBRyw2QkFBWSxDQUFDSCxNQUFNLENBQUMsQ0FBRCxDQUFQLEVBQVlBLE1BQU0sQ0FBQyxDQUFELENBQWxCLEVBQXVCQyxNQUFNLENBQUMsQ0FBRCxDQUE3QixFQUFrQ0EsTUFBTSxDQUFDLENBQUQsQ0FBeEMsQ0FBWixDQUFsQjtBQUNBRSxNQUFBQSxTQUFTLENBQUNDLFVBQVYsR0FBdUJELFNBQVMsQ0FBQ0MsVUFBVixJQUF3QixFQUEvQztBQUNBRCxNQUFBQSxTQUFTLENBQUNDLFVBQVYsQ0FBcUJDLEtBQXJCLEdBQTZCLFdBQTdCLENBSDBGLENBSzFGOztBQUNBLGFBQU9GLFNBQVA7QUFDRDs7OztFQVJvQ0csd0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYmJveFBvbHlnb24gZnJvbSAnQHR1cmYvYmJveC1wb2x5Z29uJztcbmltcG9ydCB7IFBvc2l0aW9uLCBQb2x5Z29uLCBGZWF0dXJlT2YgfSBmcm9tICcuLi9nZW9qc29uLXR5cGVzJztcbmltcG9ydCB7IFR3b0NsaWNrUG9seWdvbk1vZGUgfSBmcm9tICcuL3R3by1jbGljay1wb2x5Z29uLW1vZGUnO1xuXG5leHBvcnQgY2xhc3MgRHJhd1JlY3RhbmdsZU1vZGUgZXh0ZW5kcyBUd29DbGlja1BvbHlnb25Nb2RlIHtcbiAgZ2V0VHdvQ2xpY2tQb2x5Z29uKGNvb3JkMTogUG9zaXRpb24sIGNvb3JkMjogUG9zaXRpb24sIG1vZGVDb25maWc6IGFueSk6IEZlYXR1cmVPZjxQb2x5Z29uPiB7XG4gICAgY29uc3QgcmVjdGFuZ2xlID0gYmJveFBvbHlnb24oW2Nvb3JkMVswXSwgY29vcmQxWzFdLCBjb29yZDJbMF0sIGNvb3JkMlsxXV0pO1xuICAgIHJlY3RhbmdsZS5wcm9wZXJ0aWVzID0gcmVjdGFuZ2xlLnByb3BlcnRpZXMgfHwge307XG4gICAgcmVjdGFuZ2xlLnByb3BlcnRpZXMuc2hhcGUgPSAnUmVjdGFuZ2xlJztcblxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICByZXR1cm4gcmVjdGFuZ2xlO1xuICB9XG59XG4iXX0=