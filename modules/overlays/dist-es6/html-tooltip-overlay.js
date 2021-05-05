"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var React = _interopRequireWildcard(require("react"));

var _htmlOverlay = _interopRequireDefault(require("./html-overlay"));

var _htmlOverlayItem = _interopRequireDefault(require("./html-overlay-item"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var styles = {
  tooltip: {
    transform: 'translate(-50%,-100%)',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: '4px 8px',
    borderRadius: 8,
    color: 'white'
  }
};
var SHOW_TOOLTIP_TIMEOUT = 250;

var HtmlTooltipOverlay = /*#__PURE__*/function (_HtmlOverlay) {
  _inherits(HtmlTooltipOverlay, _HtmlOverlay);

  var _super = _createSuper(HtmlTooltipOverlay);

  function HtmlTooltipOverlay(props) {
    var _this;

    _classCallCheck(this, HtmlTooltipOverlay);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "timeoutID", null);

    _defineProperty(_assertThisInitialized(_this), "state", void 0);

    _this.state = {
      visible: false,
      pickingInfo: null
    };
    return _this;
  }

  _createClass(HtmlTooltipOverlay, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      var _this2 = this;

      this.context.nebula.queryObjectEvents.on('pick', function (_ref) {
        var event = _ref.event,
            pickingInfo = _ref.pickingInfo;

        if (_this2.timeoutID !== null) {
          window.clearTimeout(_this2.timeoutID);
        }

        _this2.timeoutID = null;

        if (pickingInfo && _this2._getTooltip(pickingInfo)) {
          _this2.timeoutID = window.setTimeout(function () {
            _this2.setState({
              visible: true,
              pickingInfo: pickingInfo
            });
          }, SHOW_TOOLTIP_TIMEOUT);
        } else {
          _this2.setState({
            visible: false
          });
        }
      });
    }
  }, {
    key: "_getTooltip",
    value: function _getTooltip(pickingInfo) {
      return pickingInfo.object.style.tooltip;
    }
  }, {
    key: "_makeOverlay",
    value: function _makeOverlay() {
      var pickingInfo = this.state.pickingInfo;

      if (pickingInfo) {
        return /*#__PURE__*/React.createElement(_htmlOverlayItem["default"], {
          key: 0,
          coordinates: pickingInfo.lngLat,
          style: styles.tooltip
        }, this._getTooltip(pickingInfo));
      }

      return null;
    }
  }, {
    key: "getItems",
    value: function getItems() {
      if (this.state.visible) {
        return [this._makeOverlay()];
      }

      return [];
    }
  }]);

  return HtmlTooltipOverlay;
}(_htmlOverlay["default"]);

exports["default"] = HtmlTooltipOverlay;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9odG1sLXRvb2x0aXAtb3ZlcmxheS50c3giXSwibmFtZXMiOlsic3R5bGVzIiwidG9vbHRpcCIsInRyYW5zZm9ybSIsImJhY2tncm91bmRDb2xvciIsInBhZGRpbmciLCJib3JkZXJSYWRpdXMiLCJjb2xvciIsIlNIT1dfVE9PTFRJUF9USU1FT1VUIiwiSHRtbFRvb2x0aXBPdmVybGF5IiwicHJvcHMiLCJzdGF0ZSIsInZpc2libGUiLCJwaWNraW5nSW5mbyIsImNvbnRleHQiLCJuZWJ1bGEiLCJxdWVyeU9iamVjdEV2ZW50cyIsIm9uIiwiZXZlbnQiLCJ0aW1lb3V0SUQiLCJ3aW5kb3ciLCJjbGVhclRpbWVvdXQiLCJfZ2V0VG9vbHRpcCIsInNldFRpbWVvdXQiLCJzZXRTdGF0ZSIsIm9iamVjdCIsInN0eWxlIiwibG5nTGF0IiwiX21ha2VPdmVybGF5IiwiSHRtbE92ZXJsYXkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFFQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFPQSxJQUFNQSxNQUFNLEdBQUc7QUFDYkMsRUFBQUEsT0FBTyxFQUFFO0FBQ1BDLElBQUFBLFNBQVMsRUFBRSx1QkFESjtBQUVQQyxJQUFBQSxlQUFlLEVBQUUsb0JBRlY7QUFHUEMsSUFBQUEsT0FBTyxFQUFFLFNBSEY7QUFJUEMsSUFBQUEsWUFBWSxFQUFFLENBSlA7QUFLUEMsSUFBQUEsS0FBSyxFQUFFO0FBTEE7QUFESSxDQUFmO0FBVUEsSUFBTUMsb0JBQW9CLEdBQUcsR0FBN0I7O0lBRXFCQyxrQjs7Ozs7QUFDbkIsOEJBQVlDLEtBQVosRUFBd0I7QUFBQTs7QUFBQTs7QUFDdEIsOEJBQU1BLEtBQU47O0FBRHNCLGdFQXNCZSxJQXRCZjs7QUFBQTs7QUFFdEIsVUFBS0MsS0FBTCxHQUFhO0FBQUVDLE1BQUFBLE9BQU8sRUFBRSxLQUFYO0FBQWtCQyxNQUFBQSxXQUFXLEVBQUU7QUFBL0IsS0FBYjtBQUZzQjtBQUd2Qjs7Ozt5Q0FFb0I7QUFBQTs7QUFDbkIsV0FBS0MsT0FBTCxDQUFhQyxNQUFiLENBQW9CQyxpQkFBcEIsQ0FBc0NDLEVBQXRDLENBQXlDLE1BQXpDLEVBQWlELGdCQUE0QjtBQUFBLFlBQXpCQyxLQUF5QixRQUF6QkEsS0FBeUI7QUFBQSxZQUFsQkwsV0FBa0IsUUFBbEJBLFdBQWtCOztBQUMzRSxZQUFJLE1BQUksQ0FBQ00sU0FBTCxLQUFtQixJQUF2QixFQUE2QjtBQUMzQkMsVUFBQUEsTUFBTSxDQUFDQyxZQUFQLENBQW9CLE1BQUksQ0FBQ0YsU0FBekI7QUFDRDs7QUFDRCxRQUFBLE1BQUksQ0FBQ0EsU0FBTCxHQUFpQixJQUFqQjs7QUFFQSxZQUFJTixXQUFXLElBQUksTUFBSSxDQUFDUyxXQUFMLENBQWlCVCxXQUFqQixDQUFuQixFQUFrRDtBQUNoRCxVQUFBLE1BQUksQ0FBQ00sU0FBTCxHQUFpQkMsTUFBTSxDQUFDRyxVQUFQLENBQWtCLFlBQU07QUFDdkMsWUFBQSxNQUFJLENBQUNDLFFBQUwsQ0FBYztBQUFFWixjQUFBQSxPQUFPLEVBQUUsSUFBWDtBQUFpQkMsY0FBQUEsV0FBVyxFQUFYQTtBQUFqQixhQUFkO0FBQ0QsV0FGZ0IsRUFFZEwsb0JBRmMsQ0FBakI7QUFHRCxTQUpELE1BSU87QUFDTCxVQUFBLE1BQUksQ0FBQ2dCLFFBQUwsQ0FBYztBQUFFWixZQUFBQSxPQUFPLEVBQUU7QUFBWCxXQUFkO0FBQ0Q7QUFDRixPQWJEO0FBY0Q7OztnQ0FLV0MsVyxFQUEwQztBQUNwRCxhQUFPQSxXQUFXLENBQUNZLE1BQVosQ0FBbUJDLEtBQW5CLENBQXlCeEIsT0FBaEM7QUFDRDs7O21DQUVjO0FBQUEsVUFDTFcsV0FESyxHQUNXLEtBQUtGLEtBRGhCLENBQ0xFLFdBREs7O0FBR2IsVUFBSUEsV0FBSixFQUFpQjtBQUNmLDRCQUNFLG9CQUFDLDJCQUFEO0FBQWlCLFVBQUEsR0FBRyxFQUFFLENBQXRCO0FBQXlCLFVBQUEsV0FBVyxFQUFFQSxXQUFXLENBQUNjLE1BQWxEO0FBQTBELFVBQUEsS0FBSyxFQUFFMUIsTUFBTSxDQUFDQztBQUF4RSxXQUNHLEtBQUtvQixXQUFMLENBQWlCVCxXQUFqQixDQURILENBREY7QUFLRDs7QUFFRCxhQUFPLElBQVA7QUFDRDs7OytCQUV5RDtBQUN4RCxVQUFJLEtBQUtGLEtBQUwsQ0FBV0MsT0FBZixFQUF3QjtBQUN0QixlQUFPLENBQUMsS0FBS2dCLFlBQUwsRUFBRCxDQUFQO0FBQ0Q7O0FBRUQsYUFBTyxFQUFQO0FBQ0Q7Ozs7RUFsRDZDQyx1QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IEh0bWxPdmVybGF5IGZyb20gJy4vaHRtbC1vdmVybGF5JztcbmltcG9ydCBIdG1sT3ZlcmxheUl0ZW0gZnJvbSAnLi9odG1sLW92ZXJsYXktaXRlbSc7XG5cbnR5cGUgU3RhdGUgPSB7XG4gIHZpc2libGU6IGJvb2xlYW47XG4gIHBpY2tpbmdJbmZvOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgbnVsbCB8IHVuZGVmaW5lZDtcbn07XG5cbmNvbnN0IHN0eWxlcyA9IHtcbiAgdG9vbHRpcDoge1xuICAgIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZSgtNTAlLC0xMDAlKScsXG4gICAgYmFja2dyb3VuZENvbG9yOiAncmdiYSgwLCAwLCAwLCAwLjMpJyxcbiAgICBwYWRkaW5nOiAnNHB4IDhweCcsXG4gICAgYm9yZGVyUmFkaXVzOiA4LFxuICAgIGNvbG9yOiAnd2hpdGUnLFxuICB9LFxufTtcblxuY29uc3QgU0hPV19UT09MVElQX1RJTUVPVVQgPSAyNTA7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEh0bWxUb29sdGlwT3ZlcmxheSBleHRlbmRzIEh0bWxPdmVybGF5IHtcbiAgY29uc3RydWN0b3IocHJvcHM6IGFueSkge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0geyB2aXNpYmxlOiBmYWxzZSwgcGlja2luZ0luZm86IG51bGwgfTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcbiAgICB0aGlzLmNvbnRleHQubmVidWxhLnF1ZXJ5T2JqZWN0RXZlbnRzLm9uKCdwaWNrJywgKHsgZXZlbnQsIHBpY2tpbmdJbmZvIH0pID0+IHtcbiAgICAgIGlmICh0aGlzLnRpbWVvdXRJRCAhPT0gbnVsbCkge1xuICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dElEKTtcbiAgICAgIH1cbiAgICAgIHRoaXMudGltZW91dElEID0gbnVsbDtcblxuICAgICAgaWYgKHBpY2tpbmdJbmZvICYmIHRoaXMuX2dldFRvb2x0aXAocGlja2luZ0luZm8pKSB7XG4gICAgICAgIHRoaXMudGltZW91dElEID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyB2aXNpYmxlOiB0cnVlLCBwaWNraW5nSW5mbyB9KTtcbiAgICAgICAgfSwgU0hPV19UT09MVElQX1RJTUVPVVQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHZpc2libGU6IGZhbHNlIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgdGltZW91dElEOiBudW1iZXIgfCBudWxsIHwgdW5kZWZpbmVkID0gbnVsbDtcbiAgc3RhdGU6IFN0YXRlO1xuXG4gIF9nZXRUb29sdGlwKHBpY2tpbmdJbmZvOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KTogc3RyaW5nIHtcbiAgICByZXR1cm4gcGlja2luZ0luZm8ub2JqZWN0LnN0eWxlLnRvb2x0aXA7XG4gIH1cblxuICBfbWFrZU92ZXJsYXkoKSB7XG4gICAgY29uc3QgeyBwaWNraW5nSW5mbyB9ID0gdGhpcy5zdGF0ZTtcblxuICAgIGlmIChwaWNraW5nSW5mbykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPEh0bWxPdmVybGF5SXRlbSBrZXk9ezB9IGNvb3JkaW5hdGVzPXtwaWNraW5nSW5mby5sbmdMYXR9IHN0eWxlPXtzdHlsZXMudG9vbHRpcH0+XG4gICAgICAgICAge3RoaXMuX2dldFRvb2x0aXAocGlja2luZ0luZm8pfVxuICAgICAgICA8L0h0bWxPdmVybGF5SXRlbT5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBnZXRJdGVtcygpOiBBcnJheTxSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgbnVsbCB8IHVuZGVmaW5lZD4ge1xuICAgIGlmICh0aGlzLnN0YXRlLnZpc2libGUpIHtcbiAgICAgIHJldHVybiBbdGhpcy5fbWFrZU92ZXJsYXkoKV07XG4gICAgfVxuXG4gICAgcmV0dXJuIFtdO1xuICB9XG59XG4iXX0=