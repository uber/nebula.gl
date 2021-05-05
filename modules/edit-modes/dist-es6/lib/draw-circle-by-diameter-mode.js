"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DrawCircleByDiameterMode = void 0;

var _circle = _interopRequireDefault(require("@turf/circle"));

var _distance = _interopRequireDefault(require("@turf/distance"));

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

var DrawCircleByDiameterMode = /*#__PURE__*/function (_TwoClickPolygonMode) {
  _inherits(DrawCircleByDiameterMode, _TwoClickPolygonMode);

  var _super = _createSuper(DrawCircleByDiameterMode);

  function DrawCircleByDiameterMode() {
    _classCallCheck(this, DrawCircleByDiameterMode);

    return _super.apply(this, arguments);
  }

  _createClass(DrawCircleByDiameterMode, [{
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

      var centerCoordinates = (0, _geojsonEditMode.getIntermediatePosition)(coord1, coord2);
      var radius = Math.max((0, _distance["default"])(coord1, centerCoordinates), 0.001);
      var geometry = (0, _circle["default"])(centerCoordinates, radius, options);
      geometry.properties = geometry.properties || {};
      geometry.properties.shape = 'Circle';
      return geometry;
    }
  }]);

  return DrawCircleByDiameterMode;
}(_twoClickPolygonMode.TwoClickPolygonMode);

exports.DrawCircleByDiameterMode = DrawCircleByDiameterMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvZHJhdy1jaXJjbGUtYnktZGlhbWV0ZXItbW9kZS50cyJdLCJuYW1lcyI6WyJEcmF3Q2lyY2xlQnlEaWFtZXRlck1vZGUiLCJjb29yZDEiLCJjb29yZDIiLCJtb2RlQ29uZmlnIiwic3RlcHMiLCJvcHRpb25zIiwiY29uc29sZSIsIndhcm4iLCJjZW50ZXJDb29yZGluYXRlcyIsInJhZGl1cyIsIk1hdGgiLCJtYXgiLCJnZW9tZXRyeSIsInByb3BlcnRpZXMiLCJzaGFwZSIsIlR3b0NsaWNrUG9seWdvbk1vZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFFQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFYUEsd0I7Ozs7Ozs7Ozs7Ozs7dUNBQ1FDLE0sRUFBa0JDLE0sRUFBa0JDLFUsRUFBcUM7QUFDMUY7QUFEMEYsaUJBRW5FQSxVQUFVLElBQUksRUFGcUQ7QUFBQSw0QkFFbEZDLEtBRmtGO0FBQUEsVUFFbEZBLEtBRmtGLDJCQUUxRSxFQUYwRTs7QUFHMUYsVUFBTUMsT0FBTyxHQUFHO0FBQUVELFFBQUFBLEtBQUssRUFBTEE7QUFBRixPQUFoQjs7QUFFQSxVQUFJQSxLQUFLLEdBQUcsQ0FBWixFQUFlO0FBQ2JFLFFBQUFBLE9BQU8sQ0FBQ0MsSUFBUix5Q0FEYSxDQUN5Qzs7QUFDdERGLFFBQUFBLE9BQU8sQ0FBQ0QsS0FBUixHQUFnQixDQUFoQjtBQUNEOztBQUVELFVBQU1JLGlCQUFpQixHQUFHLDhDQUF3QlAsTUFBeEIsRUFBZ0NDLE1BQWhDLENBQTFCO0FBQ0EsVUFBTU8sTUFBTSxHQUFHQyxJQUFJLENBQUNDLEdBQUwsQ0FBUywwQkFBU1YsTUFBVCxFQUFpQk8saUJBQWpCLENBQVQsRUFBOEMsS0FBOUMsQ0FBZjtBQUVBLFVBQU1JLFFBQVEsR0FBRyx3QkFBT0osaUJBQVAsRUFBMEJDLE1BQTFCLEVBQWtDSixPQUFsQyxDQUFqQjtBQUVBTyxNQUFBQSxRQUFRLENBQUNDLFVBQVQsR0FBc0JELFFBQVEsQ0FBQ0MsVUFBVCxJQUF1QixFQUE3QztBQUNBRCxNQUFBQSxRQUFRLENBQUNDLFVBQVQsQ0FBb0JDLEtBQXBCLEdBQTRCLFFBQTVCO0FBRUEsYUFBT0YsUUFBUDtBQUNEOzs7O0VBcEIyQ0csd0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2lyY2xlIGZyb20gJ0B0dXJmL2NpcmNsZSc7XG5pbXBvcnQgZGlzdGFuY2UgZnJvbSAnQHR1cmYvZGlzdGFuY2UnO1xuaW1wb3J0IHsgUG9zaXRpb24sIFBvbHlnb24sIEZlYXR1cmVPZiB9IGZyb20gJy4uL2dlb2pzb24tdHlwZXMnO1xuaW1wb3J0IHsgZ2V0SW50ZXJtZWRpYXRlUG9zaXRpb24gfSBmcm9tICcuL2dlb2pzb24tZWRpdC1tb2RlJztcbmltcG9ydCB7IFR3b0NsaWNrUG9seWdvbk1vZGUgfSBmcm9tICcuL3R3by1jbGljay1wb2x5Z29uLW1vZGUnO1xuXG5leHBvcnQgY2xhc3MgRHJhd0NpcmNsZUJ5RGlhbWV0ZXJNb2RlIGV4dGVuZHMgVHdvQ2xpY2tQb2x5Z29uTW9kZSB7XG4gIGdldFR3b0NsaWNrUG9seWdvbihjb29yZDE6IFBvc2l0aW9uLCBjb29yZDI6IFBvc2l0aW9uLCBtb2RlQ29uZmlnOiBhbnkpOiBGZWF0dXJlT2Y8UG9seWdvbj4ge1xuICAgIC8vIERlZmF1bHQgdHVyZiB2YWx1ZSBmb3IgY2lyY2xlIGlzIDY0XG4gICAgY29uc3QgeyBzdGVwcyA9IDY0IH0gPSBtb2RlQ29uZmlnIHx8IHt9O1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7IHN0ZXBzIH07XG5cbiAgICBpZiAoc3RlcHMgPCA0KSB7XG4gICAgICBjb25zb2xlLndhcm4oYE1pbmltdW0gc3RlcHMgdG8gZHJhdyBhIGNpcmNsZSBpcyA0IGApOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGUsbm8tdW5kZWZcbiAgICAgIG9wdGlvbnMuc3RlcHMgPSA0O1xuICAgIH1cblxuICAgIGNvbnN0IGNlbnRlckNvb3JkaW5hdGVzID0gZ2V0SW50ZXJtZWRpYXRlUG9zaXRpb24oY29vcmQxLCBjb29yZDIpO1xuICAgIGNvbnN0IHJhZGl1cyA9IE1hdGgubWF4KGRpc3RhbmNlKGNvb3JkMSwgY2VudGVyQ29vcmRpbmF0ZXMpLCAwLjAwMSk7XG5cbiAgICBjb25zdCBnZW9tZXRyeSA9IGNpcmNsZShjZW50ZXJDb29yZGluYXRlcywgcmFkaXVzLCBvcHRpb25zKTtcblxuICAgIGdlb21ldHJ5LnByb3BlcnRpZXMgPSBnZW9tZXRyeS5wcm9wZXJ0aWVzIHx8IHt9O1xuICAgIGdlb21ldHJ5LnByb3BlcnRpZXMuc2hhcGUgPSAnQ2lyY2xlJztcblxuICAgIHJldHVybiBnZW9tZXRyeTtcbiAgfVxufVxuIl19