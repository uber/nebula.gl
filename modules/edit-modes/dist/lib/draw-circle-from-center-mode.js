"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DrawCircleFromCenterMode = void 0;

var _circle = _interopRequireDefault(require("@turf/circle"));

var _distance = _interopRequireDefault(require("@turf/distance"));

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

var DrawCircleFromCenterMode = /*#__PURE__*/function (_TwoClickPolygonMode) {
  _inherits(DrawCircleFromCenterMode, _TwoClickPolygonMode);

  var _super = _createSuper(DrawCircleFromCenterMode);

  function DrawCircleFromCenterMode() {
    _classCallCheck(this, DrawCircleFromCenterMode);

    return _super.apply(this, arguments);
  }

  _createClass(DrawCircleFromCenterMode, [{
    key: "getTwoClickPolygon",
    value: function getTwoClickPolygon(coord1, coord2, modeConfig) {
      // Default turf value for circle is 64
      var _ref = modeConfig || {},
          _ref$steps = _ref.steps,
          steps = _ref$steps === void 0 ? 64 : _ref$steps;

      var options = {
        steps: steps
      };

      if (steps < 4) {
        console.warn("Minimum steps to draw a circle is 4 "); // eslint-disable-line no-console,no-undef

        options.steps = 4;
      }

      var radius = Math.max((0, _distance["default"])(coord1, coord2), 0.001);
      var geometry = (0, _circle["default"])(coord1, radius, options);
      geometry.properties = geometry.properties || {};
      geometry.properties.shape = 'Circle';
      return geometry;
    }
  }]);

  return DrawCircleFromCenterMode;
}(_twoClickPolygonMode.TwoClickPolygonMode);

exports.DrawCircleFromCenterMode = DrawCircleFromCenterMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvZHJhdy1jaXJjbGUtZnJvbS1jZW50ZXItbW9kZS50cyJdLCJuYW1lcyI6WyJEcmF3Q2lyY2xlRnJvbUNlbnRlck1vZGUiLCJjb29yZDEiLCJjb29yZDIiLCJtb2RlQ29uZmlnIiwic3RlcHMiLCJvcHRpb25zIiwiY29uc29sZSIsIndhcm4iLCJyYWRpdXMiLCJNYXRoIiwibWF4IiwiZ2VvbWV0cnkiLCJwcm9wZXJ0aWVzIiwic2hhcGUiLCJUd29DbGlja1BvbHlnb25Nb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRWFBLHdCOzs7Ozs7Ozs7Ozs7O3VDQUNRQyxNLEVBQWtCQyxNLEVBQWtCQyxVLEVBQXFDO0FBQzFGO0FBRDBGLGlCQUVuRUEsVUFBVSxJQUFJLEVBRnFEO0FBQUEsNEJBRWxGQyxLQUZrRjtBQUFBLFVBRWxGQSxLQUZrRiwyQkFFMUUsRUFGMEU7O0FBRzFGLFVBQU1DLE9BQU8sR0FBRztBQUFFRCxRQUFBQSxLQUFLLEVBQUxBO0FBQUYsT0FBaEI7O0FBRUEsVUFBSUEsS0FBSyxHQUFHLENBQVosRUFBZTtBQUNiRSxRQUFBQSxPQUFPLENBQUNDLElBQVIseUNBRGEsQ0FDeUM7O0FBQ3RERixRQUFBQSxPQUFPLENBQUNELEtBQVIsR0FBZ0IsQ0FBaEI7QUFDRDs7QUFFRCxVQUFNSSxNQUFNLEdBQUdDLElBQUksQ0FBQ0MsR0FBTCxDQUFTLDBCQUFTVCxNQUFULEVBQWlCQyxNQUFqQixDQUFULEVBQW1DLEtBQW5DLENBQWY7QUFDQSxVQUFNUyxRQUFRLEdBQUcsd0JBQU9WLE1BQVAsRUFBZU8sTUFBZixFQUF1QkgsT0FBdkIsQ0FBakI7QUFFQU0sTUFBQUEsUUFBUSxDQUFDQyxVQUFULEdBQXNCRCxRQUFRLENBQUNDLFVBQVQsSUFBdUIsRUFBN0M7QUFDQUQsTUFBQUEsUUFBUSxDQUFDQyxVQUFULENBQW9CQyxLQUFwQixHQUE0QixRQUE1QjtBQUVBLGFBQU9GLFFBQVA7QUFDRDs7OztFQWxCMkNHLHdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNpcmNsZSBmcm9tICdAdHVyZi9jaXJjbGUnO1xuaW1wb3J0IGRpc3RhbmNlIGZyb20gJ0B0dXJmL2Rpc3RhbmNlJztcbmltcG9ydCB7IFBvc2l0aW9uLCBQb2x5Z29uLCBGZWF0dXJlT2YgfSBmcm9tICcuLi9nZW9qc29uLXR5cGVzJztcbmltcG9ydCB7IFR3b0NsaWNrUG9seWdvbk1vZGUgfSBmcm9tICcuL3R3by1jbGljay1wb2x5Z29uLW1vZGUnO1xuXG5leHBvcnQgY2xhc3MgRHJhd0NpcmNsZUZyb21DZW50ZXJNb2RlIGV4dGVuZHMgVHdvQ2xpY2tQb2x5Z29uTW9kZSB7XG4gIGdldFR3b0NsaWNrUG9seWdvbihjb29yZDE6IFBvc2l0aW9uLCBjb29yZDI6IFBvc2l0aW9uLCBtb2RlQ29uZmlnOiBhbnkpOiBGZWF0dXJlT2Y8UG9seWdvbj4ge1xuICAgIC8vIERlZmF1bHQgdHVyZiB2YWx1ZSBmb3IgY2lyY2xlIGlzIDY0XG4gICAgY29uc3QgeyBzdGVwcyA9IDY0IH0gPSBtb2RlQ29uZmlnIHx8IHt9O1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7IHN0ZXBzIH07XG5cbiAgICBpZiAoc3RlcHMgPCA0KSB7XG4gICAgICBjb25zb2xlLndhcm4oYE1pbmltdW0gc3RlcHMgdG8gZHJhdyBhIGNpcmNsZSBpcyA0IGApOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGUsbm8tdW5kZWZcbiAgICAgIG9wdGlvbnMuc3RlcHMgPSA0O1xuICAgIH1cblxuICAgIGNvbnN0IHJhZGl1cyA9IE1hdGgubWF4KGRpc3RhbmNlKGNvb3JkMSwgY29vcmQyKSwgMC4wMDEpO1xuICAgIGNvbnN0IGdlb21ldHJ5ID0gY2lyY2xlKGNvb3JkMSwgcmFkaXVzLCBvcHRpb25zKTtcblxuICAgIGdlb21ldHJ5LnByb3BlcnRpZXMgPSBnZW9tZXRyeS5wcm9wZXJ0aWVzIHx8IHt9O1xuICAgIGdlb21ldHJ5LnByb3BlcnRpZXMuc2hhcGUgPSAnQ2lyY2xlJztcblxuICAgIHJldHVybiBnZW9tZXRyeTtcbiAgfVxufVxuIl19