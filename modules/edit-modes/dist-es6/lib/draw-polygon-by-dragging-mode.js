"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DrawPolygonByDraggingMode = void 0;

var _lodash = _interopRequireDefault(require("lodash.throttle"));

var _utils = require("../utils");

var _drawPolygonMode = require("./draw-polygon-mode");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DrawPolygonByDraggingMode = /*#__PURE__*/function (_DrawPolygonMode) {
  _inherits(DrawPolygonByDraggingMode, _DrawPolygonMode);

  var _super = _createSuper(DrawPolygonByDraggingMode);

  function DrawPolygonByDraggingMode() {
    var _this;

    _classCallCheck(this, DrawPolygonByDraggingMode);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "handleDraggingThrottled", null);

    return _this;
  }

  _createClass(DrawPolygonByDraggingMode, [{
    key: "handleClick",
    value: function handleClick(event, props) {// No-op
    }
  }, {
    key: "handleStartDragging",
    value: function handleStartDragging(event, props) {
      event.cancelPan();

      if (props.modeConfig && props.modeConfig.throttleMs) {
        this.handleDraggingThrottled = (0, _lodash["default"])(this.handleDraggingAux, props.modeConfig.throttleMs);
      } else {
        this.handleDraggingThrottled = this.handleDraggingAux;
      }
    }
  }, {
    key: "handleStopDragging",
    value: function handleStopDragging(event, props) {
      this.addClickSequence(event);
      var clickSequence = this.getClickSequence(); // @ts-ignore

      if (this.handleDraggingThrottled && this.handleDraggingThrottled.cancel) {
        // @ts-ignore
        this.handleDraggingThrottled.cancel();
      }

      if (clickSequence.length > 2) {
        // Complete the polygon.
        var polygonToAdd = {
          type: 'Polygon',
          coordinates: [[].concat(_toConsumableArray(clickSequence), [clickSequence[0]])]
        };
        this.resetClickSequence();
        var editAction = this.getAddFeatureOrBooleanPolygonAction(polygonToAdd, props);

        if (editAction) {
          props.onEdit(editAction);
        }
      }
    }
  }, {
    key: "handleDraggingAux",
    value: function handleDraggingAux(event, props) {
      var picks = event.picks;
      var clickedEditHandle = (0, _utils.getPickedEditHandle)(picks);

      if (!clickedEditHandle) {
        // Don't add another point right next to an existing one.
        this.addClickSequence(event);
      }
    }
  }, {
    key: "handleDragging",
    value: function handleDragging(event, props) {
      if (this.handleDraggingThrottled) {
        this.handleDraggingThrottled(event, props);
      }
    }
  }]);

  return DrawPolygonByDraggingMode;
}(_drawPolygonMode.DrawPolygonMode);

exports.DrawPolygonByDraggingMode = DrawPolygonByDraggingMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvZHJhdy1wb2x5Z29uLWJ5LWRyYWdnaW5nLW1vZGUudHMiXSwibmFtZXMiOlsiRHJhd1BvbHlnb25CeURyYWdnaW5nTW9kZSIsImV2ZW50IiwicHJvcHMiLCJjYW5jZWxQYW4iLCJtb2RlQ29uZmlnIiwidGhyb3R0bGVNcyIsImhhbmRsZURyYWdnaW5nVGhyb3R0bGVkIiwiaGFuZGxlRHJhZ2dpbmdBdXgiLCJhZGRDbGlja1NlcXVlbmNlIiwiY2xpY2tTZXF1ZW5jZSIsImdldENsaWNrU2VxdWVuY2UiLCJjYW5jZWwiLCJsZW5ndGgiLCJwb2x5Z29uVG9BZGQiLCJ0eXBlIiwiY29vcmRpbmF0ZXMiLCJyZXNldENsaWNrU2VxdWVuY2UiLCJlZGl0QWN0aW9uIiwiZ2V0QWRkRmVhdHVyZU9yQm9vbGVhblBvbHlnb25BY3Rpb24iLCJvbkVkaXQiLCJwaWNrcyIsImNsaWNrZWRFZGl0SGFuZGxlIiwiRHJhd1BvbHlnb25Nb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBU0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFJYUEseUI7Ozs7Ozs7Ozs7Ozs7Ozs7OEVBQ21ELEk7Ozs7Ozs7Z0NBRWxEQyxLLEVBQW1CQyxLLEVBQXFDLENBQ2xFO0FBQ0Q7Ozt3Q0FFbUJELEssRUFBMkJDLEssRUFBcUM7QUFDbEZELE1BQUFBLEtBQUssQ0FBQ0UsU0FBTjs7QUFDQSxVQUFJRCxLQUFLLENBQUNFLFVBQU4sSUFBb0JGLEtBQUssQ0FBQ0UsVUFBTixDQUFpQkMsVUFBekMsRUFBcUQ7QUFDbkQsYUFBS0MsdUJBQUwsR0FBK0Isd0JBQVMsS0FBS0MsaUJBQWQsRUFBaUNMLEtBQUssQ0FBQ0UsVUFBTixDQUFpQkMsVUFBbEQsQ0FBL0I7QUFDRCxPQUZELE1BRU87QUFDTCxhQUFLQyx1QkFBTCxHQUErQixLQUFLQyxpQkFBcEM7QUFDRDtBQUNGOzs7dUNBRWtCTixLLEVBQTBCQyxLLEVBQXFDO0FBQ2hGLFdBQUtNLGdCQUFMLENBQXNCUCxLQUF0QjtBQUNBLFVBQU1RLGFBQWEsR0FBRyxLQUFLQyxnQkFBTCxFQUF0QixDQUZnRixDQUdoRjs7QUFDQSxVQUFJLEtBQUtKLHVCQUFMLElBQWdDLEtBQUtBLHVCQUFMLENBQTZCSyxNQUFqRSxFQUF5RTtBQUN2RTtBQUNBLGFBQUtMLHVCQUFMLENBQTZCSyxNQUE3QjtBQUNEOztBQUVELFVBQUlGLGFBQWEsQ0FBQ0csTUFBZCxHQUF1QixDQUEzQixFQUE4QjtBQUM1QjtBQUNBLFlBQU1DLFlBQXFCLEdBQUc7QUFDNUJDLFVBQUFBLElBQUksRUFBRSxTQURzQjtBQUU1QkMsVUFBQUEsV0FBVyxFQUFFLDhCQUFLTixhQUFMLElBQW9CQSxhQUFhLENBQUMsQ0FBRCxDQUFqQztBQUZlLFNBQTlCO0FBS0EsYUFBS08sa0JBQUw7QUFFQSxZQUFNQyxVQUFVLEdBQUcsS0FBS0MsbUNBQUwsQ0FBeUNMLFlBQXpDLEVBQXVEWCxLQUF2RCxDQUFuQjs7QUFDQSxZQUFJZSxVQUFKLEVBQWdCO0FBQ2RmLFVBQUFBLEtBQUssQ0FBQ2lCLE1BQU4sQ0FBYUYsVUFBYjtBQUNEO0FBQ0Y7QUFDRjs7O3NDQUVpQmhCLEssRUFBc0JDLEssRUFBcUM7QUFBQSxVQUNuRWtCLEtBRG1FLEdBQ3pEbkIsS0FEeUQsQ0FDbkVtQixLQURtRTtBQUUzRSxVQUFNQyxpQkFBaUIsR0FBRyxnQ0FBb0JELEtBQXBCLENBQTFCOztBQUVBLFVBQUksQ0FBQ0MsaUJBQUwsRUFBd0I7QUFDdEI7QUFDQSxhQUFLYixnQkFBTCxDQUFzQlAsS0FBdEI7QUFDRDtBQUNGOzs7bUNBRWNBLEssRUFBc0JDLEssRUFBcUM7QUFDeEUsVUFBSSxLQUFLSSx1QkFBVCxFQUFrQztBQUNoQyxhQUFLQSx1QkFBTCxDQUE2QkwsS0FBN0IsRUFBb0NDLEtBQXBDO0FBQ0Q7QUFDRjs7OztFQXZENENvQixnQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0aHJvdHRsZSBmcm9tICdsb2Rhc2gudGhyb3R0bGUnO1xuaW1wb3J0IHtcbiAgQ2xpY2tFdmVudCxcbiAgU3RhcnREcmFnZ2luZ0V2ZW50LFxuICBTdG9wRHJhZ2dpbmdFdmVudCxcbiAgRHJhZ2dpbmdFdmVudCxcbiAgTW9kZVByb3BzLFxufSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBQb2x5Z29uLCBGZWF0dXJlQ29sbGVjdGlvbiB9IGZyb20gJy4uL2dlb2pzb24tdHlwZXMnO1xuaW1wb3J0IHsgZ2V0UGlja2VkRWRpdEhhbmRsZSB9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCB7IERyYXdQb2x5Z29uTW9kZSB9IGZyb20gJy4vZHJhdy1wb2x5Z29uLW1vZGUnO1xuXG50eXBlIERyYWdnaW5nSGFuZGxlciA9IChldmVudDogRHJhZ2dpbmdFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pID0+IHZvaWQ7XG5cbmV4cG9ydCBjbGFzcyBEcmF3UG9seWdvbkJ5RHJhZ2dpbmdNb2RlIGV4dGVuZHMgRHJhd1BvbHlnb25Nb2RlIHtcbiAgaGFuZGxlRHJhZ2dpbmdUaHJvdHRsZWQ6IERyYWdnaW5nSGFuZGxlciB8IG51bGwgfCB1bmRlZmluZWQgPSBudWxsO1xuXG4gIGhhbmRsZUNsaWNrKGV2ZW50OiBDbGlja0V2ZW50LCBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPikge1xuICAgIC8vIE5vLW9wXG4gIH1cblxuICBoYW5kbGVTdGFydERyYWdnaW5nKGV2ZW50OiBTdGFydERyYWdnaW5nRXZlbnQsIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KSB7XG4gICAgZXZlbnQuY2FuY2VsUGFuKCk7XG4gICAgaWYgKHByb3BzLm1vZGVDb25maWcgJiYgcHJvcHMubW9kZUNvbmZpZy50aHJvdHRsZU1zKSB7XG4gICAgICB0aGlzLmhhbmRsZURyYWdnaW5nVGhyb3R0bGVkID0gdGhyb3R0bGUodGhpcy5oYW5kbGVEcmFnZ2luZ0F1eCwgcHJvcHMubW9kZUNvbmZpZy50aHJvdHRsZU1zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5oYW5kbGVEcmFnZ2luZ1Rocm90dGxlZCA9IHRoaXMuaGFuZGxlRHJhZ2dpbmdBdXg7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlU3RvcERyYWdnaW5nKGV2ZW50OiBTdG9wRHJhZ2dpbmdFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pIHtcbiAgICB0aGlzLmFkZENsaWNrU2VxdWVuY2UoZXZlbnQpO1xuICAgIGNvbnN0IGNsaWNrU2VxdWVuY2UgPSB0aGlzLmdldENsaWNrU2VxdWVuY2UoKTtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgaWYgKHRoaXMuaGFuZGxlRHJhZ2dpbmdUaHJvdHRsZWQgJiYgdGhpcy5oYW5kbGVEcmFnZ2luZ1Rocm90dGxlZC5jYW5jZWwpIHtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHRoaXMuaGFuZGxlRHJhZ2dpbmdUaHJvdHRsZWQuY2FuY2VsKCk7XG4gICAgfVxuXG4gICAgaWYgKGNsaWNrU2VxdWVuY2UubGVuZ3RoID4gMikge1xuICAgICAgLy8gQ29tcGxldGUgdGhlIHBvbHlnb24uXG4gICAgICBjb25zdCBwb2x5Z29uVG9BZGQ6IFBvbHlnb24gPSB7XG4gICAgICAgIHR5cGU6ICdQb2x5Z29uJyxcbiAgICAgICAgY29vcmRpbmF0ZXM6IFtbLi4uY2xpY2tTZXF1ZW5jZSwgY2xpY2tTZXF1ZW5jZVswXV1dLFxuICAgICAgfTtcblxuICAgICAgdGhpcy5yZXNldENsaWNrU2VxdWVuY2UoKTtcblxuICAgICAgY29uc3QgZWRpdEFjdGlvbiA9IHRoaXMuZ2V0QWRkRmVhdHVyZU9yQm9vbGVhblBvbHlnb25BY3Rpb24ocG9seWdvblRvQWRkLCBwcm9wcyk7XG4gICAgICBpZiAoZWRpdEFjdGlvbikge1xuICAgICAgICBwcm9wcy5vbkVkaXQoZWRpdEFjdGlvbik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlRHJhZ2dpbmdBdXgoZXZlbnQ6IERyYWdnaW5nRXZlbnQsIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KSB7XG4gICAgY29uc3QgeyBwaWNrcyB9ID0gZXZlbnQ7XG4gICAgY29uc3QgY2xpY2tlZEVkaXRIYW5kbGUgPSBnZXRQaWNrZWRFZGl0SGFuZGxlKHBpY2tzKTtcblxuICAgIGlmICghY2xpY2tlZEVkaXRIYW5kbGUpIHtcbiAgICAgIC8vIERvbid0IGFkZCBhbm90aGVyIHBvaW50IHJpZ2h0IG5leHQgdG8gYW4gZXhpc3Rpbmcgb25lLlxuICAgICAgdGhpcy5hZGRDbGlja1NlcXVlbmNlKGV2ZW50KTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVEcmFnZ2luZyhldmVudDogRHJhZ2dpbmdFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pIHtcbiAgICBpZiAodGhpcy5oYW5kbGVEcmFnZ2luZ1Rocm90dGxlZCkge1xuICAgICAgdGhpcy5oYW5kbGVEcmFnZ2luZ1Rocm90dGxlZChldmVudCwgcHJvcHMpO1xuICAgIH1cbiAgfVxufVxuIl19