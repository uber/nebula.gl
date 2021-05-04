"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DrawCircleByBoundingBoxHandler = void 0;

var _circle = _interopRequireDefault(require("@turf/circle"));

var _distance = _interopRequireDefault(require("@turf/distance"));

var _modeHandler = require("./mode-handler");

var _twoClickPolygonHandler = require("./two-click-polygon-handler");

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

// TODO edit-modes: delete handlers once EditMode fully implemented
var DrawCircleByBoundingBoxHandler = /*#__PURE__*/function (_TwoClickPolygonHandl) {
  _inherits(DrawCircleByBoundingBoxHandler, _TwoClickPolygonHandl);

  var _super = _createSuper(DrawCircleByBoundingBoxHandler);

  function DrawCircleByBoundingBoxHandler() {
    _classCallCheck(this, DrawCircleByBoundingBoxHandler);

    return _super.apply(this, arguments);
  }

  _createClass(DrawCircleByBoundingBoxHandler, [{
    key: "handlePointerMove",
    value: function handlePointerMove(event) {
      var result = {
        editAction: null,
        cancelMapPan: false
      };
      var clickSequence = this.getClickSequence();

      if (clickSequence.length === 0) {
        // nothing to do yet
        return result;
      }

      var modeConfig = this.getModeConfig() || {}; // Default turf value for circle is 64

      var _modeConfig$steps = modeConfig.steps,
          steps = _modeConfig$steps === void 0 ? 64 : _modeConfig$steps;
      var options = {
        steps: steps
      };

      if (steps < 4) {
        console.warn("Minimum steps to draw a circle is 4 "); // eslint-disable-line no-console,no-undef

        options.steps = 4;
      }

      var firstClickedPoint = clickSequence[0];
      var centerCoordinates = (0, _modeHandler.getIntermediatePosition)(firstClickedPoint, event.groundCoords);
      var radius = Math.max((0, _distance["default"])(firstClickedPoint, centerCoordinates), 0.001);

      this._setTentativeFeature((0, _circle["default"])(centerCoordinates, radius, options));

      return result;
    }
  }]);

  return DrawCircleByBoundingBoxHandler;
}(_twoClickPolygonHandler.TwoClickPolygonHandler);

exports.DrawCircleByBoundingBoxHandler = DrawCircleByBoundingBoxHandler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL2RyYXctY2lyY2xlLWJ5LWJvdW5kaW5nLWJveC1oYW5kbGVyLnRzIl0sIm5hbWVzIjpbIkRyYXdDaXJjbGVCeUJvdW5kaW5nQm94SGFuZGxlciIsImV2ZW50IiwicmVzdWx0IiwiZWRpdEFjdGlvbiIsImNhbmNlbE1hcFBhbiIsImNsaWNrU2VxdWVuY2UiLCJnZXRDbGlja1NlcXVlbmNlIiwibGVuZ3RoIiwibW9kZUNvbmZpZyIsImdldE1vZGVDb25maWciLCJzdGVwcyIsIm9wdGlvbnMiLCJjb25zb2xlIiwid2FybiIsImZpcnN0Q2xpY2tlZFBvaW50IiwiY2VudGVyQ29vcmRpbmF0ZXMiLCJncm91bmRDb29yZHMiLCJyYWRpdXMiLCJNYXRoIiwibWF4IiwiX3NldFRlbnRhdGl2ZUZlYXR1cmUiLCJUd29DbGlja1BvbHlnb25IYW5kbGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBRUE7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7SUFDYUEsOEI7Ozs7Ozs7Ozs7Ozs7c0NBRVRDLEssRUFDc0U7QUFDdEUsVUFBTUMsTUFBTSxHQUFHO0FBQUVDLFFBQUFBLFVBQVUsRUFBRSxJQUFkO0FBQW9CQyxRQUFBQSxZQUFZLEVBQUU7QUFBbEMsT0FBZjtBQUNBLFVBQU1DLGFBQWEsR0FBRyxLQUFLQyxnQkFBTCxFQUF0Qjs7QUFFQSxVQUFJRCxhQUFhLENBQUNFLE1BQWQsS0FBeUIsQ0FBN0IsRUFBZ0M7QUFDOUI7QUFDQSxlQUFPTCxNQUFQO0FBQ0Q7O0FBRUQsVUFBTU0sVUFBVSxHQUFHLEtBQUtDLGFBQUwsTUFBd0IsRUFBM0MsQ0FUc0UsQ0FVdEU7O0FBVnNFLDhCQVcvQ0QsVUFYK0MsQ0FXOURFLEtBWDhEO0FBQUEsVUFXOURBLEtBWDhELGtDQVd0RCxFQVhzRDtBQVl0RSxVQUFNQyxPQUFPLEdBQUc7QUFBRUQsUUFBQUEsS0FBSyxFQUFMQTtBQUFGLE9BQWhCOztBQUVBLFVBQUlBLEtBQUssR0FBRyxDQUFaLEVBQWU7QUFDYkUsUUFBQUEsT0FBTyxDQUFDQyxJQUFSLHlDQURhLENBQ3lDOztBQUN0REYsUUFBQUEsT0FBTyxDQUFDRCxLQUFSLEdBQWdCLENBQWhCO0FBQ0Q7O0FBRUQsVUFBTUksaUJBQWlCLEdBQUdULGFBQWEsQ0FBQyxDQUFELENBQXZDO0FBQ0EsVUFBTVUsaUJBQWlCLEdBQUcsMENBQXdCRCxpQkFBeEIsRUFBMkNiLEtBQUssQ0FBQ2UsWUFBakQsQ0FBMUI7QUFDQSxVQUFNQyxNQUFNLEdBQUdDLElBQUksQ0FBQ0MsR0FBTCxDQUFTLDBCQUFTTCxpQkFBVCxFQUE0QkMsaUJBQTVCLENBQVQsRUFBeUQsS0FBekQsQ0FBZjs7QUFDQSxXQUFLSyxvQkFBTCxDQUEwQix3QkFBT0wsaUJBQVAsRUFBMEJFLE1BQTFCLEVBQWtDTixPQUFsQyxDQUExQjs7QUFFQSxhQUFPVCxNQUFQO0FBQ0Q7Ozs7RUE1QmlEbUIsOEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2lyY2xlIGZyb20gJ0B0dXJmL2NpcmNsZSc7XG5pbXBvcnQgZGlzdGFuY2UgZnJvbSAnQHR1cmYvZGlzdGFuY2UnO1xuaW1wb3J0IHsgUG9pbnRlck1vdmVFdmVudCB9IGZyb20gJy4uL2V2ZW50LXR5cGVzJztcbmltcG9ydCB7IEVkaXRBY3Rpb24sIGdldEludGVybWVkaWF0ZVBvc2l0aW9uIH0gZnJvbSAnLi9tb2RlLWhhbmRsZXInO1xuaW1wb3J0IHsgVHdvQ2xpY2tQb2x5Z29uSGFuZGxlciB9IGZyb20gJy4vdHdvLWNsaWNrLXBvbHlnb24taGFuZGxlcic7XG5cbi8vIFRPRE8gZWRpdC1tb2RlczogZGVsZXRlIGhhbmRsZXJzIG9uY2UgRWRpdE1vZGUgZnVsbHkgaW1wbGVtZW50ZWRcbmV4cG9ydCBjbGFzcyBEcmF3Q2lyY2xlQnlCb3VuZGluZ0JveEhhbmRsZXIgZXh0ZW5kcyBUd29DbGlja1BvbHlnb25IYW5kbGVyIHtcbiAgaGFuZGxlUG9pbnRlck1vdmUoXG4gICAgZXZlbnQ6IFBvaW50ZXJNb3ZlRXZlbnRcbiAgKTogeyBlZGl0QWN0aW9uOiBFZGl0QWN0aW9uIHwgbnVsbCB8IHVuZGVmaW5lZDsgY2FuY2VsTWFwUGFuOiBib29sZWFuIH0ge1xuICAgIGNvbnN0IHJlc3VsdCA9IHsgZWRpdEFjdGlvbjogbnVsbCwgY2FuY2VsTWFwUGFuOiBmYWxzZSB9O1xuICAgIGNvbnN0IGNsaWNrU2VxdWVuY2UgPSB0aGlzLmdldENsaWNrU2VxdWVuY2UoKTtcblxuICAgIGlmIChjbGlja1NlcXVlbmNlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgLy8gbm90aGluZyB0byBkbyB5ZXRcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgY29uc3QgbW9kZUNvbmZpZyA9IHRoaXMuZ2V0TW9kZUNvbmZpZygpIHx8IHt9O1xuICAgIC8vIERlZmF1bHQgdHVyZiB2YWx1ZSBmb3IgY2lyY2xlIGlzIDY0XG4gICAgY29uc3QgeyBzdGVwcyA9IDY0IH0gPSBtb2RlQ29uZmlnO1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7IHN0ZXBzIH07XG5cbiAgICBpZiAoc3RlcHMgPCA0KSB7XG4gICAgICBjb25zb2xlLndhcm4oYE1pbmltdW0gc3RlcHMgdG8gZHJhdyBhIGNpcmNsZSBpcyA0IGApOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGUsbm8tdW5kZWZcbiAgICAgIG9wdGlvbnMuc3RlcHMgPSA0O1xuICAgIH1cblxuICAgIGNvbnN0IGZpcnN0Q2xpY2tlZFBvaW50ID0gY2xpY2tTZXF1ZW5jZVswXTtcbiAgICBjb25zdCBjZW50ZXJDb29yZGluYXRlcyA9IGdldEludGVybWVkaWF0ZVBvc2l0aW9uKGZpcnN0Q2xpY2tlZFBvaW50LCBldmVudC5ncm91bmRDb29yZHMpO1xuICAgIGNvbnN0IHJhZGl1cyA9IE1hdGgubWF4KGRpc3RhbmNlKGZpcnN0Q2xpY2tlZFBvaW50LCBjZW50ZXJDb29yZGluYXRlcyksIDAuMDAxKTtcbiAgICB0aGlzLl9zZXRUZW50YXRpdmVGZWF0dXJlKGNpcmNsZShjZW50ZXJDb29yZGluYXRlcywgcmFkaXVzLCBvcHRpb25zKSk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG4iXX0=